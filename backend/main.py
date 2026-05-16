from importlib.resources import path

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
# import smtplib
# from email.mime.multipart import MIMEMultipart
# from email.mime.base import MIMEBase
# from email.mime.text import MIMEText
# from email import encoders
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
from fastapi import BackgroundTasks
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import requests

load_dotenv()

print("MONGO_URL:", os.getenv("MONGO_URL"))
print("EMAIL_USER:", os.getenv("EMAIL_USER"))
print("EMAIL_PASS:", os.getenv("EMAIL_PASS"))  # ✅ ADD HERE
print("SENDER_EMAIL:", os.getenv("SENDER_EMAIL"))

app = FastAPI()





cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

@app.get("/ping")
def ping():
    return {"status": "alive"}


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



# Contact
@app.post("/contact")
async def contact_form(
    background_tasks: BackgroundTasks,   # ✅ ADD THIS
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
    background_tasks.add_task(
        send_email,
        name,
        email,
        phone,
        company,
        message,
        file_path
    )

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
    import requests
    import base64
    import os

    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": os.getenv("EMAIL_PASS"),  # ✅ your working key
        "content-type": "application/json"
    }

    formatted_message = message.replace("\n", "<br>")

    # ✅ FIX (avoid crash if phone empty)
    formatted_phone = phone if phone else "N/A"

    attachment_note = (
        """
        <p style="margin-top: 20px; font-size: 14px; color: gray;">
        📎 Resume/CV attached with this email
        </p>
        """
        if file_path
        else ""
    )

    # ✅ DESIGN 
    html_content = f"""
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
            
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px; font-weight: bold; width: 30%;">Name:</td>
                    <td style="padding: 10px; word-break: break-word; white-space: normal;">
                        {name}
                    </td>
                </tr>

                <tr style="background: #f9f9f9;">
                    <td style="padding: 10px; font-weight: bold;">Email:</td>
                    <td style="padding: 10px; word-break: break-word; white-space: normal;">
                        {email}
                    </td>
                </tr>

                <tr>
                    <td style="padding: 10px; font-weight: bold;">Phone:</td>
                    <td style="padding: 10px;">{formatted_phone}</td>
                </tr>

                <tr style="background: #f9f9f9;">
                    <td style="padding: 10px; font-weight: bold;">Company:</td>
                    <td style="padding: 10px; word-break: break-word; white-space: normal;">
                        {company}
                    </td>
                </tr>
            </table>

            <!-- Message -->
            <div style="margin-top: 20px;">
                <h3>Message</h3>
                <div style="background: #f4f6f8; padding: 15px; border-radius: 6px;">
                    {formatted_message}
                </div>
            </div>

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

    data = {
        "sender": {
            "name": "Candid Resourcing Partners",
            "email": os.getenv("SENDER_EMAIL")
        },
        "to": [
            {
                "email": os.getenv("EMAIL_RECEIVER")
            }
        ],
        "subject": f"New Enquiry from {name} | Candid Website",
        "htmlContent": html_content
    }

    # ✅ ATTACHMENT SUPPORT
    if file_path and os.path.exists(file_path):
        with open(file_path, "rb") as f:
            encoded_file = base64.b64encode(f.read()).decode()

        data["attachment"] = [{
            "content": encoded_file,
            "name": os.path.basename(file_path)
        }]

    try:
        response = requests.post(url, json=data, headers=headers)
        print("✅ Brevo API:", response.status_code, response.text)

    except Exception as e:
        print("❌ Email API error:", str(e))

    # ✅ CLEANUP
    if file_path and os.path.exists(file_path):
        os.remove(file_path)



# -------------------------
# ✅ DATABASE
# -------------------------



MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")

if not MONGO_URL or not DB_NAME:
    raise Exception("❌ Missing environment variables")

client = MongoClient(MONGO_URL)
db = client[DB_NAME]


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

@app.on_event("startup")
def create_admins():
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




@app.post("/admin/login")
def admin_login(email: str = Body(...), password: str = Body(...)):

    admin = admins_collection.find_one({"email": email})

    if not admin or not verify_password(password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"email": email})

    return {"message": "Login successful ✅", "token": token}



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
    import uuid

    # ✅ unique filename
    unique_name = f"{uuid.uuid4()}_{file.filename}"
    file_path = f"uploads/{unique_name}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    BASE_URL = os.getenv("BASE_URL")

    return {
        "url": f"{BASE_URL}/uploads/{unique_name}"
    }



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
    news = news_collection.find_one({"_id": ObjectId(id)})

    if not news:
        return {"error": "News not found"}

    # 🔥 DELETE FROM CLOUDINARY
    for sec in news.get("sections", []):
        if sec.get("image_public_id"):
            try:
                cloudinary.uploader.destroy(sec["image_public_id"])
            except Exception as e:
                print("Error deleting image:", e)

        if sec.get("image2_public_id"):
            try:
                cloudinary.uploader.destroy(sec["image2_public_id"])
            except Exception as e:
                print("Error deleting image2:", e)

    # 🔥 DELETE FROM DB
    news_collection.delete_one({"_id": ObjectId(id)})

    return {"message": "Deleted with images ✅"}


# =====================================================
# 🔥 JOBS APIs (NEW SYSTEM)
# =====================================================


# ➕ ADD JOB
@app.post("/add-job")
def add_job(data: dict):
    inserted = jobs_collection.insert_one(data)

    notifications_collection.insert_one(
        {
            "type": "job",
            "title": f"New Job: {data.get('title')}",
            "message": data.get("location"),
            "link": "/create-job",
            "date": datetime.now(),
        }
    )

    return {"id": str(inserted.inserted_id), "message": "Job added"}


# 📥 GET JOBS
@app.get("/jobs")
def get_jobs():
    jobs = list(jobs_collection.find())

    for job in jobs:
        job["id"] = str(job["_id"])
        del job["_id"]

    return jobs


# ❌ DELETE JOB
@app.delete("/delete-job/{id}")
def delete_job(id: str):
    jobs_collection.delete_one({"_id": ObjectId(id)})
    return {"message": "Deleted"}


@app.put("/update-job/{id}")
def update_job(id: str, data: dict):
    jobs_collection.update_one({"_id": ObjectId(id)}, {"$set": data})

    return {"id": id, "message": "Updated"}


# =====================================================
# 📝 Applicants
# =====================================================


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

                BASE_URL = os.getenv("BASE_URL")
                return {"src": f"{BASE_URL}/{path}"}

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
