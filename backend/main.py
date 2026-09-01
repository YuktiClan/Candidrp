from fastapi import FastAPI, Form, UploadFile, File
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from bson import ObjectId
import os
import mammoth
import uuid
import re
from datetime import datetime
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
from typing import Optional
import html

from typing import List
from fastapi import Body

from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import random
from dotenv import load_dotenv
from fastapi import Depends, HTTPException
from jose import jwt, JWTError

from pathlib import Path

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)


app = FastAPI()

import gspread
from google.oauth2.service_account import Credentials

# 🔐 Setup Google Sheets API
scope = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

creds = Credentials.from_service_account_file("credentials.json", scopes=scope)

client_gsheet = gspread.authorize(creds)

# SHEET_ID = "1sTWFLra6JIS3NYyA_VTW2kcGHsv6DLHpYPvYOQF3SY"
# SHEET_NAME = "Form_Responses"


SHEET_ID = os.getenv("SHEET_ID")
SHEET_NAME = os.getenv("SHEET_NAME")


# admin login password
def validate_password(password):
    if len(password) < 8 or len(password) > 20:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[0-9]", password):
        return False
    if not re.search(r"[!@#$%^&*]", password):
        return False
    return True


# @app.post("/auth/send-otp")
# def send_otp(data: dict = Body(...)):
#     email = data.get("email")

#     if not email:
#         return {"error": "Email required"}

#     # 🔥 CHECK IF ALREADY REGISTERED
#     if admins_collection.find_one({"email": email}):
#         return {"error": "Already exists"}

#     otp = str(random.randint(100000, 999999))

#     otp_collection.insert_one(
#         {
#             "email": email,
#             "otp": otp,
#             "expires_at": datetime.utcnow() + timedelta(minutes=10),
#         }
#     )

#     send_email(
#         name="Verification",
#         email=email,
#         phone="",
#         company="",
#         message=f"Your OTP is: {otp}",
#         file_path=None,
#     )

#     return {"message": "OTP sent ✅"}


# @app.post("/auth/verify-otp")
# def verify_otp(data: dict = Body(...)):
#     email = data.get("email")
#     otp = data.get("otp")

#     record = otp_collection.find_one({"email": email, "otp": otp})

#     if not record:
#         return {"error": "Invalid OTP"}

#     if record["expires_at"] < datetime.utcnow():
#         return {"error": "OTP expired"}

#     return {"message": "OTP verified ✅"}


# Contact
@app.post("/contact")
async def contact_form(
    email: str = Form(...),
    name: str = Form(...),
    company: str = Form(""),
    phone: str = Form(""),
    message: str = Form(""),
    file: UploadFile = File(None),
):  # ❗ allow only safe files
    # VALIDATION
    if not email.strip() or not name.strip() or not message.strip():
        return {"message": "Email, Name and Message are required fields"}

    file_path = None

    if file and file.filename and file.filename.strip():
        if not file.filename.endswith((".pdf", ".doc", ".docx")):
            return {"message": "Only PDF/DOC/DOCX allowed"}

        unique_name = f"{uuid.uuid4()}_{file.filename}"
        file_path = f"uploads/{unique_name}"

        with open(file_path, "wb") as f:
            f.write(await file.read())

    # ✅ Save file temporarily

    # ✅ Store in MongoDB
    db["contacts"].insert_one(
        {
            "email": email,
            "name": name,
            "company": company,
            "phone": phone,
            "message": message,
            "file": file.filename if file and file.filename else None,
            "date": datetime.now(),
        }
    )

    notifications_collection.insert_one(
        {
            "type": "contact",
            "title": f"New Contact: {name}",
            "message": email,
            "link": "/contacts",
            "date": datetime.now(),
        }
    )

    # ✅ Send Email
    try:
        send_email(name, email, phone, company, message, file_path)
    except Exception as e:
        print("EMAIL ERROR:", e)

    return {"message": "Form submitted & email sent ✅"}


@app.get("/contacts")
def get_contacts():
    contacts = list(db["contacts"].find().sort("date", -1))  # latest first

    for c in contacts:
        c["id"] = str(c["_id"])
        del c["_id"]

    return contacts


def format_phone(phone):
    if phone.startswith("91"):
        return f"+91 {phone[2:]}"
    return f"+{phone}"


def send_email(name, email, phone, company, message, file_path):

    # sender_email = "no-reply@candidrp.com" -- Required App password setup for this email
    # receiver_email = "hr@candidrp.com"

    # sender_email = "deveshsharma.sap@gmail.com"
    # receiver_email = "deveshsharma9958@gmail.com"

    sender_email = os.getenv("EMAIL_USER")
    receiver_email = os.getenv("EMAIL_RECEIVER")

    msg = MIMEMultipart()
    # msg["From"] = "Candid Resourcing Partners <deveshsharma.sap@gmail.com>"

    msg["From"] = f"Candid Resourcing Partners <{sender_email}>"
    msg["Reply-To"] = email
    msg["To"] = receiver_email
    msg["Subject"] = f"New Enquiry from {name} | Candid Website"

    formatted_message = message.replace("\n", "<br>")
    formatted_phone = format_phone(phone)

    attachment_note = (
        """
    <p style="margin-top: 20px; font-size: 14px; color: gray;">
    📎 Resume/CV attached with this email
    </p>
    """
        if file_path
        else ""
    )

    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(90deg, #4e0f89, #6c2bd9); color: white; padding: 20px;">
            <h2 style="margin: 0;">New Contact Form Submission</h2>
            <p style="margin: 5px 0 0;">Candid Resourcing Partners</p>
        </div>

        <!-- Content -->
        <div style="padding: 20px;">
            
            <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
                <tr>
                    <td style="padding: 10px; font-weight: bold; width: 30%; vertical-align: top;">
                        Name:
                    </td>
                    <td style="padding: 10px; word-break: break-word;">
                        {name}
                    </td>
                </tr>

                <tr style="background: #f9f9f9;">
                    <td style="padding: 10px; font-weight: bold; vertical-align: top;">
                        Email:
                    </td>
                    <td style="padding: 10px; word-break: break-word;">
                        {email}
                    </td>
                </tr>
                
                
                

                <tr>
                    <td style="padding: 10px; font-weight: bold; vertical-align: top;">
                        Phone:
                    </td>
                    <td style="padding: 10px; word-break: break-word;">
                        {formatted_phone}
                    </td>
                </tr>

                <tr style="background: #f9f9f9;">
                    <td style="padding: 10px; font-weight: bold; vertical-align: top;">
                        Company:
                    </td>
                    <td style="padding: 10px; word-break: break-word;">
                        {company}
                    </td>
                </tr>
            </table>

            <!-- Message -->
            <div style="margin-top: 20px;">
            <h3 style="margin-bottom: 5px;">Message</h3>
            <div style="background: #f4f6f8; padding: 15px; border-radius: 6px;">
                {formatted_message}
            </div>
            </div>

            <!-- Attachment Note -->
            {attachment_note}
            

        </div>

        <!-- Footer -->
        <div style="background: #f4f6f8; padding: 15px; text-align: center; font-size: 12px; color: gray;">
            This email was sent from Candid Website Contact Form
        </div>

        </div>

    </body>
    </html>
    """
    msg.attach(MIMEText(html_body, "html"))

    # 📎 Attach file
    if file_path:
        with open(file_path, "rb") as f:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(f.read())

        encoders.encode_base64(part)
        filename = os.path.basename(file_path)

        part.add_header("Content-Disposition", f"attachment; filename={filename}")

        msg.attach(part)

    # SMTP
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()

    # app_password = "tvqh bmwp yezh djoh"
    app_password = os.getenv("EMAIL_PASS")

    server.login(sender_email, app_password.replace(" ", ""))
    server.send_message(msg)
    server.quit()

    # 🔥 DELETE FILE AFTER EMAIL
    if file_path and os.path.exists(file_path):
        os.remove(file_path)


# -------------------------
# ✅ DATABASE
# -------------------------


# client = MongoClient(
#     "mongodb+srv://candidrp:candidrp1234@cluster0.shhcs3n.mongodb.net/?appName=Cluster0"
# )
# db = client["candid"]


client = MongoClient(os.getenv("MONGO_URL"))
db = client[os.getenv("DB_NAME")]


news_collection = db["news"]
jobs_collection = db["jobs"]
articles_collection = db["articles"]
# notes_collection = db["notes"]
otp_collection = db["email_otps"]
notifications_collection = db["notifications"]


# -------------------------
# ✅ CORS
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # keep * for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# ✅ Contact Admin Section
# -------------------------
if not os.path.exists("uploads"):
    os.makedirs("uploads")

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.delete("/delete-contacts")
def delete_selected_contacts(ids: List[str] = Body(...)):
    object_ids = [ObjectId(i) for i in ids]
    result = db["contacts"].delete_many({"_id": {"$in": object_ids}})

    return {"message": f"{result.deleted_count} contacts deleted ✅"}


@app.delete("/delete-contacts-by-month")
def delete_contacts_by_month(month: int, year: int):
    from datetime import datetime

    start = datetime(year, month, 1)

    if month == 12:
        end = datetime(year + 1, 1, 1)
    else:
        end = datetime(year, month + 1, 1)

    result = db["contacts"].delete_many({"date": {"$gte": start, "$lt": end}})

    return {"message": f"{result.deleted_count} contacts deleted for {month}/{year} ✅"}


@app.delete("/delete-all-contacts")
def delete_all_contacts():
    result = db["contacts"].delete_many({})

    return {"message": f"{result.deleted_count} contacts deleted (ALL) ⚠️"}


# =========================
# 🔐 AUTH CONFIG Admin
# =========================

# SECRET_KEY = "supersecretkey123"   # change in production

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

admins_collection = db["admins"]
reset_tokens_collection = db["password_resets"]


def hash_password(password):
    password = password[:72]  # bcrypt limit
    return pwd_context.hash(password)


def verify_password(plain, hashed):
    plain = plain[:72]
    return pwd_context.verify(plain, hashed)


admins = [
    {
        "email": "admin@candidrp.com",
        "password": hash_password("Admin@123"),
    },
    {
        "email": "developer@yuktic.com",
        "password": hash_password("Admin@123"),
    },
]

for admin in admins:
    existing = admins_collection.find_one({"email": admin["email"]})
    if not existing:
        admins_collection.insert_one(admin)


# def verify_password(plain, hashed):
#     plain = plain[:72]
#     return pwd_context.verify(plain, hashed)


def create_token(data: dict):
    admin = admins_collection.find_one({"email": data["email"]})

    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=5)

    to_encode.update(
        {
            "exp": expire,
            "password_changed_at": str(admin.get("password_changed_at", "")),
        }
    )

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        email = payload.get("email")
        token_pwd_time = payload.get("password_changed_at")

        admin = admins_collection.find_one({"email": email})

        if not admin:
            raise HTTPException(status_code=401, detail="User not found")

        db_pwd_time = str(admin.get("password_changed_at", ""))

        # 🔥 MAIN CHECK
        if token_pwd_time != db_pwd_time:
            raise HTTPException(
                status_code=401, detail="Token expired due to password change"
            )

        return payload

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# @app.post("/auth/register")
# def register_user(data: dict):

#     email = data.get("email")
#     password = data.get("password")

#     if not validate_password(password):
#         return {"error": "Weak password"}

#     if admins_collection.find_one({"email": email}):
#         return {"error": "Already exists"}

#     admins_collection.insert_one(
#         {
#             "email": email,
#             "name": data.get("name"),
#             "company": data.get("company"),
#             "phone": data.get("phone"),
#             "password": hash_password(password),
#             "created_at": datetime.utcnow(),
#         }
#     )

#     return {"message": "Registered successfully ✅"}


@app.post("/admin/login")
def admin_login(email: str = Body(...), password: str = Body(...)):

    admin = admins_collection.find_one({"email": email})

    if not admin or not verify_password(password, admin["password"]):
        return {"error": "Invalid credentials"}

    token = create_token({"email": email})

    return {"message": "Login successful ✅", "token": token}


# @app.post("/admin/forgot-password")
# def forgot_password(email: str = Body(...)):

#     admin = admins_collection.find_one({"email": email})

#     if not admin:
#         return {"error": "Email not registered"}

#     otp = str(random.randint(100000, 999999))

#     reset_tokens_collection.insert_one(
#         {
#             "email": email,
#             "otp": otp,
#             "expires_at": datetime.utcnow() + timedelta(minutes=10),
#         }
#     )

#     # 🔥 SEND EMAIL (reuse your email function)
#     send_email(
#         name="Admin",
#         email=email,
#         phone="",
#         company="",
#         message=f"Your OTP is: {otp}",
#         file_path=None,
#     )

#     return {"message": "OTP sent to email ✅"}


@app.post("/admin/reset-password")
def reset_password(email: str = Body(...), new_password: str = Body(...)):

    admin = admins_collection.find_one({"email": email})

    if not admin:
        return {"error": "User not found"}

    if not validate_password(new_password):
        return {"error": "Weak password"}

    hashed = hash_password(new_password)

    admins_collection.update_one(
        {"email": email},
        {
            "$set": {
                "password": hashed,
                "password_changed_at": datetime.utcnow(),  # ✅ ADD THIS
            }
        },
    )

    return {"message": "Password updated successfully ✅"}


# =====================================================
# 📰 NEWS APIs
# =====================================================


@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    return {"url": f"http://localhost:8000/uploads/{file.filename}"}


# @app.post("/add-news")
# async def add_news(data: dict):
#     news_collection.insert_one(data)
#     return {"message": "Added"}


@app.post("/add-news")
async def add_news(data: dict):

    title = data.get("title")
    sections = data.get("sections", [])

    if not title or not sections:
        return {"error": "Title and sections required"}

    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")

    news = {
        "title": title,
        "slug": slug,
        "sections": sections,  # 🔥 IMPORTANT
        "date": datetime.now().isoformat(),
        "status": "published",
    }

    inserted = news_collection.insert_one(news)

    notifications_collection.insert_one(
        {
            "type": "news",
            "title": f"New Post: {title}",
            "message": "Article published",
            "link": "/news",
            "date": datetime.now(),
        }
    )

    return {"id": str(inserted.inserted_id), "message": "News added successfully ✅"}


@app.get("/news")
def get_news():
    data = list(news_collection.find())

    for item in data:
        item["id"] = str(item["_id"])
        del item["_id"]

    return data


@app.put("/update-article/{id}")
def update_article(id: str, data: dict):
    articles_collection.update_one({"_id": ObjectId(id)}, {"$set": data})
    return {"message": "Article updated ✅"}


@app.put("/update/{id}")
def update_news(id: str, data: dict):
    news_collection.update_one({"_id": ObjectId(id)}, {"$set": data})
    return {"message": "Updated"}


@app.delete("/delete/{id}")
def delete_news(id: str):
    news_collection.delete_one({"_id": ObjectId(id)})
    return {"message": "Deleted"}


# =====================================================
# 🔥 JOBS APIs (NEW SYSTEM)
# =====================================================


# ➕ ADD JOB
@app.post("/add-job")
def add_job(data: dict):
    # Create a server-side publish date.
    # Do NOT depend on the frontend for this.
    published_at = datetime.utcnow()

    job = {
        **data,
        "published_at": published_at,
    }

    inserted = jobs_collection.insert_one(job)

    notifications_collection.insert_one(
        {
            "type": "job",
            "title": f"New Job: {data.get('title')}",
            "message": data.get("location"),
            "link": "/create-job",
            "date": datetime.utcnow(),
        }
    )

    return {
        "id": str(inserted.inserted_id),
        "message": "Job added",
        "published_at": published_at.isoformat() + "Z",
    }


# 📥 GET JOBS
@app.get("/jobs")
def get_jobs():
    jobs = list(
        jobs_collection
        .find()
        .sort([
            ("published_at", -1),
            ("_id", -1)
        ])
    )

    for job in jobs:
        job["id"] = str(job["_id"])
        del job["_id"]

        # Convert MongoDB datetime to JSON-friendly ISO string
        if isinstance(job.get("published_at"), datetime):
            job["published_at"] = (
                job["published_at"].isoformat() + "Z"
            )

    return jobs



@app.get("/jobs/count")
def get_jobs_count():
    total = jobs_collection.count_documents({})

    return {
        "total": total
    }

# ❌ DELETE JOB
@app.delete("/delete-job/{id}")
def delete_job(id: str):
    jobs_collection.delete_one({"_id": ObjectId(id)})
    return {"message": "Deleted"}


@app.put("/update-job/{id}")
def update_job(id: str, data: dict):

    # Never allow normal editing to change the original publish date
    data.pop("published_at", None)

    result = jobs_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return {
        "id": id,
        "message": "Updated"
    }


# =====================================================
# 📝 Applicants
# =====================================================


@app.get("/applicants")
def get_applicants():
    print("Trying to open sheet:", SHEET_ID)

    sheet = client_gsheet.open_by_key(SHEET_ID).worksheet(SHEET_NAME)

    rows = sheet.get_all_records()
    return rows


def clean_html(html):
    if not html:
        return html

    # ❌ remove font tags
    html = re.sub(r"<font[^>]*>", "", html)
    html = re.sub(r"</font>", "", html)

    # ❌ remove inline styles
    html = re.sub(r'style="[^"]*"', "", html)

    return html


# =====================================================
# 📝 ARTICLE (WORD UPLOAD SYSTEM)
# =====================================================


@app.post("/upload-article")
async def upload_article(file: UploadFile = File(...)):
    try:
        image_paths = []

        def save_image(image):
            try:
                with image.open() as image_bytes:
                    data = image_bytes.read()

                filename = f"{uuid.uuid4()}.png"
                path = f"uploads/{filename}"

                with open(path, "wb") as f:
                    f.write(data)

                image_paths.append(path)

                return {"src": f"http://localhost:8000/{path}"}

            except Exception as e:
                print("IMAGE ERROR:", e)
                return {"src": ""}

        temp_path = "temp.docx"
        with open(temp_path, "wb") as f:
            f.write(await file.read())

        with open(temp_path, "rb") as docx_file:
            result = mammoth.convert_to_html(
                docx_file, convert_image=mammoth.images.img_element(save_image)
            )

        html = clean_html(result.value)

        title = file.filename.replace(".docx", "")

        slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")

        article = {
            "title": title,
            "slug": slug,  # ✅ ADD THIS
            "content": html,
            "images": image_paths,
            "status": "published",
            "date": datetime.now().isoformat(),
        }

        inserted = articles_collection.insert_one(article)

        return {
            "id": str(inserted.inserted_id),
            "message": "Article uploaded successfully ✅",
        }

    except Exception as e:
        print("UPLOAD ERROR:", e)
        return {"error": str(e)}


# Notes Section
# @app.post("/notes")
# async def save_note(data: dict):
#     content = data.get("content")

#     if not content:
#         return {"error": "Content required"}

#     note = {"content": content, "date": datetime.now().isoformat()}

#     inserted = notes_collection.insert_one(note)

#     return {"id": str(inserted.inserted_id), "message": "Note saved ✅"}


# @app.get("/notes")
# def get_notes():
#     data = list(notes_collection.find().sort("date", -1))

#     for item in data:
#         item["id"] = str(item["_id"])
#         del item["_id"]

#     return data


# @app.delete("/notes/{id}")
# def delete_note(id: str):
#     notes_collection.delete_one({"_id": ObjectId(id)})
#     return {"message": "Deleted ✅"}


@app.get("/notifications")
def get_notifications():
    data = list(notifications_collection.find().sort("date", -1))

    for item in data:
        item["id"] = str(item["_id"])
        del item["_id"]

    return data


@app.delete("/notifications/{id}")
def delete_notification(id: str):
    try:
        notifications_collection.delete_one({"_id": ObjectId(id)})
        return {"message": "Deleted ✅"}
    except:
        return {"error": "Invalid ID"}


# notifications_collection.insert_one({
#     "type": "contact",
#     "title": f"New Contact: {os.name}",
#     "message": email,
#     "link": "/contacts",
#     "read": False,
#     "date": datetime.now()
# })


# @app.get("/articles")
# def get_articles():
#     articles = list(articles_collection.find())

#     for a in articles:
#         a["id"] = str(a["_id"])
#         del a["_id"]

#     return articles


# @app.post("/add-article")
# def add_article(data: dict):

#     sections = data.get("sections", [])

#     # 🔥 CLEAN EACH SECTION TEXT
#     for sec in sections:
#         if "text" in sec:
#             sec["text"] = clean_html(sec["text"])

#     article = {
#         "title": data.get("title"),
#         "slug": data.get("slug"),
#         "sections": sections,
#         "status": data.get("status", "published"),
#         "date": data.get("date", datetime.now().isoformat()),
#     }

#     articles_collection.insert_one(article)

#     return {"message": "Article added ✅"}


# @app.get("/article/{slug}")
# def get_article_by_slug(slug: str):
#     article = articles_collection.find_one({"slug": slug, "status": "published"})

#     if not article:
#         return {"error": "Not found"}

#     article["id"] = str(article["_id"])
#     del article["_id"]

#     # ✅ fallback for old data (VERY IMPORTANT)
#     if "sections" not in article:
#         article["sections"] = []

#     for sec in article.get("sections", []):
#         if "text" in sec:
#             sec["text"] = html.unescape(sec["text"])

#     return article


# @app.delete("/delete-article/{id}")
# def delete_article(id: str):

#     article = articles_collection.find_one({"_id": ObjectId(id)})

#     if not article:
#         return {"error": "Not found"}

#     # 🔥 DELETE IMAGES FROM STORAGE
#     for img in article.get("images", []):
#         if os.path.exists(img):
#             os.remove(img)

#     # 🔥 DELETE FROM DB
#     articles_collection.delete_one({"_id": ObjectId(id)})

#     return {"message": "Article + images deleted ✅"}
