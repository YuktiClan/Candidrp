# from importlib.resources import path

# from fastapi import FastAPI, Form, UploadFile, File
# from pymongo import MongoClient
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from bson import ObjectId
# import os
# import mammoth
# import uuid
# import re
# from datetime import datetime
# # import smtplib
# # from email.mime.multipart import MIMEMultipart
# # from email.mime.base import MIMEBase
# # from email.mime.text import MIMEText
# # from email import encoders
# from typing import Optional
# import html

# from typing import List
# from fastapi import Body

# from passlib.context import CryptContext
# from jose import jwt
# from datetime import datetime, timedelta
# import random
# from dotenv import load_dotenv
# from fastapi import Depends, HTTPException
# from jose import jwt, JWTError

# from pathlib import Path
# from fastapi import BackgroundTasks
# from dotenv import load_dotenv
# import cloudinary
# import cloudinary.uploader
# import requests

# load_dotenv()

# print("MONGO_URL:", os.getenv("MONGO_URL"))
# print("EMAIL_USER:", os.getenv("EMAIL_USER"))
# print("EMAIL_PASS:", os.getenv("EMAIL_PASS"))  # ✅ ADD HERE
# print("SENDER_EMAIL:", os.getenv("SENDER_EMAIL"))

# app = FastAPI()





# cloudinary.config(
#     cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
#     api_key=os.getenv("CLOUDINARY_API_KEY"),
#     api_secret=os.getenv("CLOUDINARY_API_SECRET")
# )

# @app.get("/")
# def home():
#     return {"message": "Backend Running"}

# @app.get("/ping")
# def ping():
#     return {"status": "alive"}


# # admin login password
# def validate_password(password):
#     if len(password) < 8 or len(password) > 20:
#         return False
#     if not re.search(r"[A-Z]", password):
#         return False
#     if not re.search(r"[0-9]", password):
#         return False
#     if not re.search(r"[!@#$%^&*]", password):
#         return False
#     return True



# # Contact
# @app.post("/contact")
# async def contact_form(
#     background_tasks: BackgroundTasks,   # ✅ ADD THIS
#     email: str = Form(...),
#     name: str = Form(...),
#     company: str = Form(""),
#     phone: str = Form(""),
#     message: str = Form(""),
#     file: UploadFile = File(None),
# ):  # ❗ allow only safe files
#     # VALIDATION
#     if not email.strip() or not name.strip() or not message.strip():
#         return {"message": "Email, Name and Message are required fields"}

#     file_path = None

#     if file and file.filename and file.filename.strip():
#         if not file.filename.endswith((".pdf", ".doc", ".docx")):
#             return {"message": "Only PDF/DOC/DOCX allowed"}

#         unique_name = f"{uuid.uuid4()}_{file.filename}"
#         file_path = f"uploads/{unique_name}"

#         with open(file_path, "wb") as f:
#             f.write(await file.read())

#     # ✅ Save file temporarily

#     # ✅ Store in MongoDB
#     db["contacts"].insert_one(
#         {
#             "email": email,
#             "name": name,
#             "company": company,
#             "phone": phone,
#             "message": message,
#             "file": file.filename if file and file.filename else None,
#             "date": datetime.now(),
#         }
#     )

#     notifications_collection.insert_one(
#         {
#             "type": "contact",
#             "title": f"New Contact: {name}",
#             "message": email,
#             "link": "/contacts",
#             "date": datetime.now(),
#         }
#     )

#     # ✅ Send Email
#     background_tasks.add_task(
#         send_email,
#         name,
#         email,
#         phone,
#         company,
#         message,
#         file_path
#     )

#     return {"message": "Form submitted & email sent ✅"}


# @app.get("/contacts")
# def get_contacts():
#     contacts = list(db["contacts"].find().sort("date", -1))  # latest first

#     for c in contacts:
#         c["id"] = str(c["_id"])
#         del c["_id"]

#     return contacts


# def format_phone(phone):
#     if phone.startswith("91"):
#         return f"+91 {phone[2:]}"
#     return f"+{phone}"




# def send_email(name, email, phone, company, message, file_path):
#     import requests
#     import base64
#     import os

#     url = "https://api.brevo.com/v3/smtp/email"

#     headers = {
#         "accept": "application/json",
#         "api-key": os.getenv("EMAIL_PASS"),  # ✅ your working key
#         "content-type": "application/json"
#     }

#     formatted_message = message.replace("\n", "<br>")

#     # ✅ FIX (avoid crash if phone empty)
#     formatted_phone = phone if phone else "N/A"

#     attachment_note = (
#         """
#         <p style="margin-top: 20px; font-size: 14px; color: gray;">
#         📎 Resume/CV attached with this email
#         </p>
#         """
#         if file_path
#         else ""
#     )

#     # ✅ DESIGN 
#     html_content = f"""
#     <html>
#     <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        
#         <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
#         <!-- Header -->
#         <div style="background: linear-gradient(90deg, #4e0f89, #6c2bd9); color: white; padding: 20px;">
#             <h2 style="margin: 0;">New Contact Form Submission</h2>
#             <p style="margin: 5px 0 0;">Candid Resourcing Partners</p>
#         </div>

#         <!-- Content -->
#         <div style="padding: 20px;">
            
#             <table style="width: 100%; border-collapse: collapse;">
#                 <tr>
#                     <td style="padding: 10px; font-weight: bold; width: 30%;">Name:</td>
#                     <td style="padding: 10px; word-break: break-word; white-space: normal;">
#                         {name}
#                     </td>
#                 </tr>

#                 <tr style="background: #f9f9f9;">
#                     <td style="padding: 10px; font-weight: bold;">Email:</td>
#                     <td style="padding: 10px; word-break: break-word; white-space: normal;">
#                         {email}
#                     </td>
#                 </tr>

#                 <tr>
#                     <td style="padding: 10px; font-weight: bold;">Phone:</td>
#                     <td style="padding: 10px;">{formatted_phone}</td>
#                 </tr>

#                 <tr style="background: #f9f9f9;">
#                     <td style="padding: 10px; font-weight: bold;">Company:</td>
#                     <td style="padding: 10px; word-break: break-word; white-space: normal;">
#                         {company}
#                     </td>
#                 </tr>
#             </table>

#             <!-- Message -->
#             <div style="margin-top: 20px;">
#                 <h3>Message</h3>
#                 <div style="background: #f4f6f8; padding: 15px; border-radius: 6px;">
#                     {formatted_message}
#                 </div>
#             </div>

#             {attachment_note}

#         </div>

#         <!-- Footer -->
#         <div style="background: #f4f6f8; padding: 15px; text-align: center; font-size: 12px; color: gray;">
#             This email was sent from Candid Website Contact Form
#         </div>

#         </div>

#     </body>
#     </html>
#     """

#     data = {
#         "sender": {
#             "name": "Candid Resourcing Partners",
#             "email": os.getenv("SENDER_EMAIL")
#         },
#         "to": [
#             {
#                 "email": os.getenv("EMAIL_RECEIVER")
#             }
#         ],
#         "subject": f"New Enquiry from {name} | Candid Website",
#         "htmlContent": html_content
#     }

#     # ✅ ATTACHMENT SUPPORT
#     if file_path and os.path.exists(file_path):
#         with open(file_path, "rb") as f:
#             encoded_file = base64.b64encode(f.read()).decode()

#         data["attachment"] = [{
#             "content": encoded_file,
#             "name": os.path.basename(file_path)
#         }]

#     try:
#         response = requests.post(url, json=data, headers=headers)
#         print("✅ Brevo API:", response.status_code, response.text)

#     except Exception as e:
#         print("❌ Email API error:", str(e))

#     # ✅ CLEANUP
#     if file_path and os.path.exists(file_path):
#         os.remove(file_path)



# # -------------------------
# # ✅ DATABASE
# # -------------------------



# MONGO_URL = os.getenv("MONGO_URL")
# DB_NAME = os.getenv("DB_NAME")

# if not MONGO_URL or not DB_NAME:
#     raise Exception("❌ Missing environment variables")

# client = MongoClient(MONGO_URL)
# db = client[DB_NAME]


# news_collection = db["news"]
# jobs_collection = db["jobs"]
# articles_collection = db["articles"]
# # notes_collection = db["notes"]
# otp_collection = db["email_otps"]
# notifications_collection = db["notifications"]


# # -------------------------
# # ✅ CORS
# # -------------------------
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # keep * for now
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # -------------------------
# # ✅ Contact Admin Section
# # -------------------------
# if not os.path.exists("uploads"):
#     os.makedirs("uploads")

# app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# @app.delete("/delete-contacts")
# def delete_selected_contacts(ids: List[str] = Body(...)):
#     object_ids = [ObjectId(i) for i in ids]
#     result = db["contacts"].delete_many({"_id": {"$in": object_ids}})

#     return {"message": f"{result.deleted_count} contacts deleted ✅"}


# @app.delete("/delete-contacts-by-month")
# def delete_contacts_by_month(month: int, year: int):
#     from datetime import datetime

#     start = datetime(year, month, 1)

#     if month == 12:
#         end = datetime(year + 1, 1, 1)
#     else:
#         end = datetime(year, month + 1, 1)

#     result = db["contacts"].delete_many({"date": {"$gte": start, "$lt": end}})

#     return {"message": f"{result.deleted_count} contacts deleted for {month}/{year} ✅"}


# @app.delete("/delete-all-contacts")
# def delete_all_contacts():
#     result = db["contacts"].delete_many({})

#     return {"message": f"{result.deleted_count} contacts deleted (ALL) ⚠️"}


# # =========================
# # 🔐 AUTH CONFIG Admin
# # =========================

# # SECRET_KEY = "supersecretkey123"   # change in production

# SECRET_KEY = os.getenv("SECRET_KEY")
# ALGORITHM = "HS256"

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# admins_collection = db["admins"]
# reset_tokens_collection = db["password_resets"]


# def hash_password(password):
#     password = password[:72]  # bcrypt limit
#     return pwd_context.hash(password)


# def verify_password(plain, hashed):
#     plain = plain[:72]
#     return pwd_context.verify(plain, hashed)

# @app.on_event("startup")
# def create_admins():
#     admins = [
#         {
#             "email": "admin@candidrp.com",
#             "password": hash_password("Admin@123"),
#         },
#         {
#             "email": "developer@yuktic.com",
#             "password": hash_password("Admin@123"),
#         },
#     ]

#     for admin in admins:
#         existing = admins_collection.find_one({"email": admin["email"]})
#         if not existing:
#             admins_collection.insert_one(admin)



# def create_token(data: dict):
#     admin = admins_collection.find_one({"email": data["email"]})

#     to_encode = data.copy()
#     expire = datetime.utcnow() + timedelta(hours=5)

#     to_encode.update(
#         {
#             "exp": expire,
#             "password_changed_at": str(admin.get("password_changed_at", "")),
#         }
#     )

#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# def verify_token(token: str):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

#         email = payload.get("email")
#         token_pwd_time = payload.get("password_changed_at")

#         admin = admins_collection.find_one({"email": email})

#         if not admin:
#             raise HTTPException(status_code=401, detail="User not found")

#         db_pwd_time = str(admin.get("password_changed_at", ""))

#         # 🔥 MAIN CHECK
#         if token_pwd_time != db_pwd_time:
#             raise HTTPException(
#                 status_code=401, detail="Token expired due to password change"
#             )

#         return payload

#     except JWTError:
#         raise HTTPException(status_code=401, detail="Invalid token")




# @app.post("/admin/login")
# def admin_login(email: str = Body(...), password: str = Body(...)):

#     admin = admins_collection.find_one({"email": email})

#     if not admin or not verify_password(password, admin["password"]):
#         raise HTTPException(status_code=401, detail="Invalid credentials")

#     token = create_token({"email": email})

#     return {"message": "Login successful ✅", "token": token}



# @app.post("/admin/reset-password")
# def reset_password(email: str = Body(...), new_password: str = Body(...)):

#     admin = admins_collection.find_one({"email": email})

#     if not admin:
#         return {"error": "User not found"}

#     if not validate_password(new_password):
#         return {"error": "Weak password"}

#     hashed = hash_password(new_password)

#     admins_collection.update_one(
#         {"email": email},
#         {
#             "$set": {
#                 "password": hashed,
#                 "password_changed_at": datetime.utcnow(),  # ✅ ADD THIS
#             }
#         },
#     )

#     return {"message": "Password updated successfully ✅"}


# # =====================================================
# # 📰 NEWS APIs
# # =====================================================


# @app.post("/upload")
# async def upload_image(file: UploadFile = File(...)):
#     import uuid

#     # ✅ unique filename
#     unique_name = f"{uuid.uuid4()}_{file.filename}"
#     file_path = f"uploads/{unique_name}"

#     with open(file_path, "wb") as f:
#         f.write(await file.read())

#     BASE_URL = os.getenv("BASE_URL")

#     return {
#         "url": f"{BASE_URL}/uploads/{unique_name}"
#     }



# @app.post("/add-news")
# async def add_news(data: dict):

#     title = data.get("title")
#     sections = data.get("sections", [])

#     if not title or not sections:
#         return {"error": "Title and sections required"}

#     slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")

#     news = {
#         "title": title,
#         "slug": slug,
#         "sections": sections,  # 🔥 IMPORTANT
#         "date": datetime.now().isoformat(),
#         "status": "published",
#     }

#     inserted = news_collection.insert_one(news)

#     notifications_collection.insert_one(
#         {
#             "type": "news",
#             "title": f"New Post: {title}",
#             "message": "Article published",
#             "link": "/news",
#             "date": datetime.now(),
#         }
#     )

#     return {"id": str(inserted.inserted_id), "message": "News added successfully ✅"}


# @app.get("/news")
# def get_news():
#     data = list(news_collection.find())

#     for item in data:
#         item["id"] = str(item["_id"])
#         del item["_id"]

#     return data


# @app.put("/update-article/{id}")
# def update_article(id: str, data: dict):
#     articles_collection.update_one({"_id": ObjectId(id)}, {"$set": data})
#     return {"message": "Article updated ✅"}


# @app.put("/update/{id}")
# def update_news(id: str, data: dict):
#     news_collection.update_one({"_id": ObjectId(id)}, {"$set": data})
#     return {"message": "Updated"}


# @app.delete("/delete/{id}")
# def delete_news(id: str):
#     news = news_collection.find_one({"_id": ObjectId(id)})

#     if not news:
#         return {"error": "News not found"}

#     # 🔥 DELETE FROM CLOUDINARY
#     for sec in news.get("sections", []):

#         # ✅ IMAGE 1
#         if sec.get("image_public_id"):
#             try:
#                 cloudinary.uploader.destroy(
#                     sec["image_public_id"]
#                 )
#             except Exception as e:
#                 print("Error deleting image:", e)

#         # ✅ IMAGE 2
#         if sec.get("image2_public_id"):
#             try:
#                 cloudinary.uploader.destroy(
#                     sec["image2_public_id"]
#                 )
#             except Exception as e:
#                 print("Error deleting image2:", e)

#         # ✅ WORD FILE
#         if sec.get("docx_public_id"):
#             try:
#                 cloudinary.uploader.destroy(
#                     sec["docx_public_id"],
#                     resource_type="raw"
#                 )
#             except Exception as e:
#                 print("Error deleting docx:", e)

#     # 🔥 DELETE FROM DB
#     news_collection.delete_one({"_id": ObjectId(id)})

#     return {"message": "Deleted with images ✅"}


# # =====================================================
# # 🔥 JOBS APIs (NEW SYSTEM)
# # =====================================================


# # ➕ ADD JOB
# # =====================================================
# # 🔥 JOBS APIs
# # =====================================================

# # =====================================================
# # ➕ ADD JOB
# # =====================================================

# @app.post("/add-job")
# def add_job(data: dict):

#     # Server controls the publish time.
#     # Frontend must NOT decide this.
#     published_at = datetime.utcnow()

#     job = {
#         **data,

#         # Always generated by backend
#         "published_at": published_at,
#     }

#     inserted = jobs_collection.insert_one(job)

#     notifications_collection.insert_one(
#         {
#             "type": "job",
#             "title": f"New Job: {data.get('title', 'Untitled Job')}",
#             "message": data.get("location", ""),
#             "link": "/create-job",
#             "date": datetime.utcnow(),
#         }
#     )

#     return {
#         "id": str(inserted.inserted_id),
#         "message": "Job added successfully ✅",
#         "published_at": published_at.isoformat() + "Z",
#     }


# # 📥 GET JOBS
# # =====================================================
# # 📥 GET JOBS
# # =====================================================

# @app.get("/jobs")
# def get_jobs():

#     jobs = list(
#         jobs_collection
#         .find()
#         .sort([
#             ("published_at", -1),
#             ("_id", -1)
#         ])
#     )

#     for job in jobs:

#         job["id"] = str(job["_id"])
#         del job["_id"]

#         # Convert Mongo datetime to JSON-safe ISO string
#         if isinstance(
#             job.get("published_at"),
#             datetime
#         ):
#             job["published_at"] = (
#                 job["published_at"].isoformat() + "Z"
#             )

#     return jobs


# # =====================================================
# # 🔢 JOB COUNT
# # =====================================================

# @app.get("/jobs/count")
# def get_jobs_count():

#     total = jobs_collection.count_documents({})

#     return {
#         "total": total
#     }

# # ❌ DELETE JOB
# # =====================================================
# # ❌ DELETE JOB
# # =====================================================

# @app.delete("/delete-job/{id}")
# def delete_job(id: str):

#     try:
#         object_id = ObjectId(id)

#     except Exception:

#         raise HTTPException(
#             status_code=400,
#             detail="Invalid job ID"
#         )

#     result = jobs_collection.delete_one(
#         {
#             "_id": object_id
#         }
#     )

#     if result.deleted_count == 0:

#         raise HTTPException(
#             status_code=404,
#             detail="Job not found"
#         )

#     return {
#         "message": "Job deleted successfully ✅"
#     }


# # =====================================================
# # ✏️ UPDATE JOB
# # =====================================================

# @app.put("/update-job/{id}")
# def update_job(
#     id: str,
#     data: dict
# ):

#     try:
#         object_id = ObjectId(id)

#     except Exception:

#         raise HTTPException(
#             status_code=400,
#             detail="Invalid job ID"
#         )

#     # -------------------------------------------------
#     # NEVER allow frontend to change publish time
#     # -------------------------------------------------

#     data.pop(
#         "published_at",
#         None
#     )

#     # Never allow Mongo ID modification
#     data.pop(
#         "_id",
#         None
#     )

#     data.pop(
#         "id",
#         None
#     )

#     if not data:

#         raise HTTPException(
#             status_code=400,
#             detail="No valid fields to update"
#         )

#     result = jobs_collection.update_one(
#         {
#             "_id": object_id
#         },
#         {
#             "$set": data
#         }
#     )

#     if result.matched_count == 0:

#         raise HTTPException(
#             status_code=404,
#             detail="Job not found"
#         )

#     return {
#         "id": id,
#         "message": "Job updated successfully ✅"
#     }


# # =====================================================
# # 📝 Applicants
# # =====================================================


# def clean_html(html):
#     if not html:
#         return html

#     # ❌ remove font tags
#     html = re.sub(r"<font[^>]*>", "", html)
#     html = re.sub(r"</font>", "", html)

#     # ❌ remove inline styles
#     html = re.sub(r'style="[^"]*"', "", html)

#     return html


# # =====================================================
# # 📝 ARTICLE (WORD UPLOAD SYSTEM)
# # =====================================================


# @app.post("/upload-article")
# async def upload_article(file: UploadFile = File(...)):
#     try:
#         image_paths = []

#         def save_image(image):
#             try:
#                 with image.open() as image_bytes:
#                     data = image_bytes.read()

#                 filename = f"{uuid.uuid4()}.png"
#                 path = f"uploads/{filename}"

#                 with open(path, "wb") as f:
#                     f.write(data)

#                 image_paths.append(path)

#                 BASE_URL = os.getenv("BASE_URL")
#                 return {"src": f"{BASE_URL}/{path}"}

#             except Exception as e:
#                 print("IMAGE ERROR:", e)
#                 return {"src": ""}

#         temp_path = "temp.docx"
#         with open(temp_path, "wb") as f:
#             f.write(await file.read())

#         with open(temp_path, "rb") as docx_file:
#             result = mammoth.convert_to_html(
#                 docx_file, convert_image=mammoth.images.img_element(save_image)
#             )

#         html = clean_html(result.value)

#         title = file.filename.replace(".docx", "")

#         slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")

#         article = {
#             "title": title,
#             "slug": slug,  # ✅ ADD THIS
#             "content": html,
#             "images": image_paths,
#             "status": "published",
#             "date": datetime.now().isoformat(),
#         }

#         inserted = articles_collection.insert_one(article)

#         return {
#             "id": str(inserted.inserted_id),
#             "message": "Article uploaded successfully ✅",
#         }

#     except Exception as e:
#         print("UPLOAD ERROR:", e)
#         return {"error": str(e)}



# @app.post("/delete-image")
# async def delete_image(data: dict):

#     public_id = data.get("public_id")

#     if not public_id:
#         return {"success": False}

#     try:
#         cloudinary.uploader.destroy(public_id)

#         return {"success": True}

#     except Exception as e:
#         return {
#             "success": False,
#             "error": str(e)
#         }
        
        
        

# @app.get("/notifications")
# def get_notifications():
#     data = list(notifications_collection.find().sort("date", -1))

#     for item in data:
#         item["id"] = str(item["_id"])
#         del item["_id"]

#     return data


# @app.delete("/notifications/{id}")
# def delete_notification(id: str):
#     try:
#         notifications_collection.delete_one({"_id": ObjectId(id)})
#         return {"message": "Deleted ✅"}
#     except:
#         return {"error": "Invalid ID"}
    
    
    



#candidrp
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


# =====================================================
# 🤖 AI / GEMINI
# =====================================================

import io
import json
import pymupdf

from google import genai
from google.genai import types

from pydantic import BaseModel, Field


load_dotenv()

# =====================================================
# 🤖 GEMINI CONFIGURATION
# =====================================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.5-flash-lite"
)

if not GEMINI_API_KEY:
    raise Exception(
        "❌ GEMINI_API_KEY is missing from .env"
    )

gemini_client = genai.Client(
    api_key=GEMINI_API_KEY
)

print("🤖 Gemini configured:", GEMINI_MODEL)


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




@app.get("/")
def home():
    return {"message": "Backend Running"}

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


# =====================================================
# 📰 NEWS APIs
# =====================================================


@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload normal article image to local uploads folder.
    """

    unique_name = f"{uuid.uuid4()}_{file.filename}"

    file_path = f"uploads/{unique_name}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    BASE_URL = os.getenv("BASE_URL")

    return {
        "url": f"{BASE_URL}/uploads/{unique_name}"
    }


# =====================================================
# ➕ CREATE NEWS / ARTICLE
# =====================================================

@app.post("/add-news")
async def add_news(data: dict):

    title = data.get("title")
    sections = data.get("sections", [])

    # ---------------------------------------------
    # VALIDATION
    # ---------------------------------------------

    if not title or not title.strip():

        raise HTTPException(
            status_code=400,
            detail="Title is required"
        )

    if not isinstance(sections, list):

        raise HTTPException(
            status_code=400,
            detail="Sections must be a list"
        )

    # ---------------------------------------------
    # STATUS
    # ---------------------------------------------

    requested_status = data.get(
        "status",
        "draft"
    )

    if requested_status not in {
        "draft",
        "published"
    }:

        raise HTTPException(
            status_code=400,
            detail="Status must be either draft or published"
        )

    # ---------------------------------------------
    # SLUG
    # ---------------------------------------------

    slug = re.sub(
        r"[^a-z0-9]+",
        "-",
        title.lower()
    ).strip("-")

    # ---------------------------------------------
    # ARTICLE
    # ---------------------------------------------

    news = {

        "title": title.strip(),

        "slug": slug,

        "sections": sections,

        "date": datetime.now().isoformat(),

        "status": requested_status,

    }

    # ---------------------------------------------
    # SAVE TO MONGODB
    # ---------------------------------------------

    inserted = news_collection.insert_one(
        news
    )

    # ---------------------------------------------
    # NOTIFICATION
    # ---------------------------------------------

    if requested_status == "published":

        notifications_collection.insert_one(
            {
                "type": "news",

                "title":
                    f"New Post: {title}",

                "message":
                    "Article published",

                "link":
                    "/news",

                "date":
                    datetime.now(),
            }
        )

    # ---------------------------------------------
    # RESPONSE
    # ---------------------------------------------

    return {

        "id":
            str(inserted.inserted_id),

        "message":
            (
                "Article published successfully ✅"
                if requested_status == "published"
                else
                "Article saved as draft ✅"
            ),

        "status":
            requested_status,

    }


# =====================================================
# 📥 GET ALL NEWS
# =====================================================

@app.get("/news")
def get_news():

    data = list(
        news_collection
        .find()
        .sort(
            [
                ("date", -1),
                ("_id", -1)
            ]
        )
    )

    for item in data:

        item["id"] = str(
            item["_id"]
        )

        del item["_id"]

    return data


# =====================================================
# ✏️ UPDATE ARTICLE
# =====================================================

@app.put("/update/{id}")
def update_news(
    id: str,
    data: dict
):

    # ---------------------------------------------
    # VALIDATE ID
    # ---------------------------------------------

    try:

        object_id = ObjectId(id)

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid article ID"
        )

    # ---------------------------------------------
    # ONLY CONTENT FIELDS
    # ---------------------------------------------
    #
    # IMPORTANT:
    #
    # This endpoint DOES NOT change status.
    #
    # Draft stays draft.
    # Published stays published.
    #
    # Status changes happen ONLY through:
    #
    # /draft/article/{id}
    # /publish/article/{id}
    #
    # ---------------------------------------------

    allowed_fields = {
        "title",
        "sections",
        "slug"
    }

    update_data = {
        key: value
        for key, value in data.items()
        if key in allowed_fields
    }

    if not update_data:

        raise HTTPException(
            status_code=400,
            detail="No valid fields to update"
        )

    # ---------------------------------------------
    # UPDATE
    # ---------------------------------------------

    result = news_collection.update_one(
        {
            "_id": object_id
        },
        {
            "$set": update_data
        }
    )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Article not found"
        )

    # ---------------------------------------------
    # RETURN CURRENT STATUS
    # ---------------------------------------------

    updated_article = news_collection.find_one(
        {
            "_id": object_id
        }
    )

    return {

        "message":
            "Article updated successfully ✅",

        "id":
            id,

        "status":
            updated_article.get(
                "status",
                "published"
            ),

    }


# =====================================================
# 📝 MOVE ARTICLE TO DRAFT
# =====================================================

@app.put("/draft/article/{id}")
def move_article_to_draft(
    id: str
):

    # ---------------------------------------------
    # VALIDATE ID
    # ---------------------------------------------

    try:

        object_id = ObjectId(id)

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid article ID"
        )

    # ---------------------------------------------
    # CHECK ARTICLE
    # ---------------------------------------------

    article = news_collection.find_one(
        {
            "_id": object_id
        }
    )

    if not article:

        raise HTTPException(
            status_code=404,
            detail="Article not found"
        )

    # ---------------------------------------------
    # CHANGE STATUS
    # ---------------------------------------------

    result = news_collection.update_one(
        {
            "_id": object_id
        },
        {
            "$set": {
                "status": "draft"
            }
        }
    )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Article not found"
        )

    # ---------------------------------------------
    # RESPONSE
    # ---------------------------------------------

    return {

        "message":
            "Article moved to draft successfully ✅",

        "id":
            id,

        "status":
            "draft",

    }


# =====================================================
# 🚀 PUBLISH ARTICLE
# =====================================================

@app.put("/publish/article/{id}")
def publish_article(
    id: str
):

    # ---------------------------------------------
    # VALIDATE ID
    # ---------------------------------------------

    try:

        object_id = ObjectId(id)

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid article ID"
        )

    # ---------------------------------------------
    # CHECK ARTICLE
    # ---------------------------------------------

    article = news_collection.find_one(
        {
            "_id": object_id
        }
    )

    if not article:

        raise HTTPException(
            status_code=404,
            detail="Article not found"
        )

    # ---------------------------------------------
    # PUBLISH
    # ---------------------------------------------

    result = news_collection.update_one(
        {
            "_id": object_id
        },
        {
            "$set": {
                "status": "published"
            }
        }
    )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Article not found"
        )

    # ---------------------------------------------
    # NOTIFICATION
    # ---------------------------------------------

    notifications_collection.insert_one(
        {
            "type":
                "news",

            "title":
                f"Article Published: {article.get('title', 'Untitled')}",

            "message":
                "Article published successfully",

            "link":
                "/news",

            "date":
                datetime.now(),
        }
    )

    # ---------------------------------------------
    # RESPONSE
    # ---------------------------------------------

    return {

        "message":
            "Article published successfully ✅",

        "id":
            id,

        "status":
            "published",

    }


# =====================================================
# 🗑️ DELETE ARTICLE
# =====================================================

@app.delete("/delete/{id}")
def delete_news(
    id: str
):

    # ---------------------------------------------
    # VALIDATE ID
    # ---------------------------------------------

    try:

        object_id = ObjectId(id)

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid article ID"
        )

    # ---------------------------------------------
    # FIND ARTICLE
    # ---------------------------------------------

    news = news_collection.find_one(
        {
            "_id": object_id
        }
    )

    if not news:

        raise HTTPException(
            status_code=404,
            detail="News not found"
        )

    # ---------------------------------------------
    # DELETE CLOUDINARY IMAGES
    # ---------------------------------------------

    for sec in news.get(
        "sections",
        []
    ):

        # -----------------------------------------
        # IMAGE 1
        # -----------------------------------------

        if sec.get(
            "image_public_id"
        ):

            try:

                cloudinary.uploader.destroy(
                    sec["image_public_id"]
                )

            except Exception as e:

                print(
                    "Error deleting image:",
                    e
                )

        # -----------------------------------------
        # IMAGE 2
        # -----------------------------------------

        if sec.get(
            "image2_public_id"
        ):

            try:

                cloudinary.uploader.destroy(
                    sec["image2_public_id"]
                )

            except Exception as e:

                print(
                    "Error deleting image2:",
                    e
                )

        # -----------------------------------------
        # WORD FILE
        # -----------------------------------------

        if sec.get(
            "docx_public_id"
        ):

            try:

                cloudinary.uploader.destroy(
                    sec["docx_public_id"],
                    resource_type="raw"
                )

            except Exception as e:

                print(
                    "Error deleting docx:",
                    e
                )

    # ---------------------------------------------
    # DELETE MONGODB DOCUMENT
    # ---------------------------------------------

    result = news_collection.delete_one(
        {
            "_id": object_id
        }
    )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="News not found"
        )

    return {

        "message":
            "Deleted with images successfully ✅"

    }


# =====================================================
# 🔥 JOBS APIs (NEW SYSTEM)
# =====================================================


# ➕ ADD JOB
# =====================================================
# 🔥 JOBS APIs
# =====================================================

# =====================================================
# ➕ ADD JOB
# =====================================================

@app.post("/add-job")
def add_job(data: dict):

    # Server controls the publish time.
    # Frontend must NOT decide this.
    published_at = datetime.utcnow()

    job = {
        **data,

        # Always generated by backend
        "published_at": published_at,
    }

    inserted = jobs_collection.insert_one(job)

    notifications_collection.insert_one(
        {
            "type": "job",
            "title": f"New Job: {data.get('title', 'Untitled Job')}",
            "message": data.get("location", ""),
            "link": "/create-job",
            "date": datetime.utcnow(),
        }
    )

    return {
        "id": str(inserted.inserted_id),
        "message": "Job added successfully ✅",
        "published_at": published_at.isoformat() + "Z",
    }


# 📥 GET JOBS
# =====================================================
# 📥 GET JOBS
# =====================================================

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

        # Convert Mongo datetime to JSON-safe ISO string
        if isinstance(
            job.get("published_at"),
            datetime
        ):
            job["published_at"] = (
                job["published_at"].isoformat() + "Z"
            )

    return jobs


# =====================================================
# 🔢 JOB COUNT
# =====================================================

@app.get("/jobs/count")
def get_jobs_count():

    total = jobs_collection.count_documents({})

    return {
        "total": total
    }

# ❌ DELETE JOB
# =====================================================
# ❌ DELETE JOB
# =====================================================

@app.delete("/delete-job/{id}")
def delete_job(id: str):

    try:
        object_id = ObjectId(id)

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid job ID"
        )

    result = jobs_collection.delete_one(
        {
            "_id": object_id
        }
    )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return {
        "message": "Job deleted successfully ✅"
    }


# =====================================================
# ✏️ UPDATE JOB
# =====================================================

@app.put("/update-job/{id}")
def update_job(
    id: str,
    data: dict
):

    try:
        object_id = ObjectId(id)

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid job ID"
        )

    # -------------------------------------------------
    # NEVER allow frontend to change publish time
    # -------------------------------------------------

    data.pop(
        "published_at",
        None
    )

    # Never allow Mongo ID modification
    data.pop(
        "_id",
        None
    )

    data.pop(
        "id",
        None
    )

    if not data:

        raise HTTPException(
            status_code=400,
            detail="No valid fields to update"
        )

    result = jobs_collection.update_one(
        {
            "_id": object_id
        },
        {
            "$set": data
        }
    )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return {
        "id": id,
        "message": "Job updated successfully ✅"
    }


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



@app.post("/delete-image")
async def delete_image(data: dict):

    public_id = data.get("public_id")

    if not public_id:
        return {"success": False}

    try:
        cloudinary.uploader.destroy(public_id)

        return {"success": True}

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
        
        
        

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
    
    
    

        
# =====================================================
# 🤖 AI ARTICLE SCHEMA
# =====================================================

class AIArticleSection(BaseModel):
    type: str = Field(
        description=(
            "CMS section type. Must be exactly one of: "
            "text, subtitle, two-text, image-left, "
            "image-right, two-image, full-image"
        )
    )

    content: str = Field(default="")

    content2: str = Field(default="")

    alignment: str = Field(
        default="left",
        description=(
            "Text alignment. Must be one of: "
            "left, center, right, justify"
        )
    )

    image_key: str = Field(
        default="",
        description=(
            "Identifier of the first PDF image. "
            "Use only identifiers from the supplied image manifest."
        )
    )

    image2_key: str = Field(
        default="",
        description=(
            "Identifier of the second PDF image. "
            "Use only identifiers from the supplied image manifest."
        )
    )

    source_page: int = Field(default=1)


class AIArticle(BaseModel):
    title: str = Field(default="")

    sections: List[AIArticleSection] = Field(
        default_factory=list
    )
    
    
# =====================================================
# 🤖 AI ARTICLE PROMPT
# =====================================================

ARTICLE_AI_PROMPT = """
You are an expert PDF document structure and layout
analysis engine.

Analyze the uploaded PDF and convert it into the CMS
article structure defined by the provided response schema.

IMPORTANT REQUIREMENTS:

1. Preserve the original text.
2. Preserve the original reading order.
3. Preserve the visual layout.
4. Preserve text/image relationships.
5. Never invent information.
6. Never invent images.
7. Never invent image identifiers.

====================================================
SUPPORTED CMS SECTION TYPES
====================================================

Only use:

text
subtitle
two-text
image-left
image-right
two-image
full-image


====================================================
TEXT
====================================================

Use "text" when normal text occupies the available width.


====================================================
SUBTITLE
====================================================

Use "subtitle" for:

- Main headings
- Section headings
- Subheadings
- Standalone titles


====================================================
TWO TEXT
====================================================

Use "two-text" when the PDF clearly contains two
separate text columns side by side.

Left column:

content

Right column:

content2


====================================================
IMAGE LEFT
====================================================

Use "image-left" when:

LEFT = IMAGE
RIGHT = TEXT

Text goes into:

content

Image identifier goes into:

image_key

Even if the image cannot be identified, still use:

image-left

and leave:

image_key = ""


====================================================
IMAGE RIGHT
====================================================

Use "image-right" when:

LEFT = TEXT
RIGHT = IMAGE

Text goes into:

content

Image identifier goes into:

image_key

Even if the image cannot be identified, still use:

image-right

and leave:

image_key = ""


====================================================
TWO IMAGE
====================================================

Use "two-image" when two images are visually arranged
side by side.

First image:

image_key

Second image:

image2_key

If an image cannot be identified, leave the identifier
empty.


====================================================
FULL IMAGE
====================================================

Use "full-image" when an image occupies most or all
of the content width.

If the image cannot be identified:

type = "full-image"

image_key = ""


====================================================
IMAGE RULE
====================================================

Only use image identifiers from the supplied IMAGE MANIFEST.

Never invent:

- image URLs
- Cloudinary URLs
- image IDs
- image identifiers

If an image cannot be confidently matched,
leave the image identifier empty.


====================================================
LAYOUT PRESERVATION
====================================================

This is extremely important.

TEXT | IMAGE

must become:

image-right

IMAGE | TEXT

must become:

image-left

IMAGE | IMAGE

must become:

two-image

FULL WIDTH IMAGE

must become:

full-image

Do not convert image layouts into normal text merely
because the image identifier is unavailable.


====================================================
TEXT ALIGNMENT
====================================================

Determine the actual visual alignment.

Allowed:

left
center
right
justify


====================================================
HTML
====================================================

Convert text into simple HTML.

Examples:

<p>Normal paragraph.</p>

<h2>Section Heading</h2>

<h3>Subheading</h3>

<strong>Important text</strong>

<ul>
<li>Item one</li>
<li>Item two</li>
</ul>

Preserve:

- Paragraphs
- Headings
- Lists
- Bold text
- Italic text
- Important formatting

Do not add unnecessary HTML.


====================================================
TITLE
====================================================

Extract the actual article title.

Do not invent a title.

If no clear title exists:

title = ""


====================================================
ORDER
====================================================

Preserve the visual reading order.

Do not reorder sections.

Do not merge unrelated sections.

Do not unnecessarily split sections.


====================================================
FINAL OUTPUT
====================================================

Return only data matching the provided structured
response schema.
"""

# =====================================================
# 📸 EXTRACT IMAGES FROM PDF
# =====================================================

def extract_pdf_images(pdf_bytes: bytes):

    extracted_images = []

    pdf = pymupdf.open(
        stream=pdf_bytes,
        filetype="pdf"
    )

    try:

        for page_index in range(len(pdf)):

            page = pdf[page_index]

            images = page.get_images(full=True)

            for image_number, image in enumerate(
                images,
                start=1
            ):

                xref = image[0]

                try:

                    base_image = pdf.extract_image(xref)

                    image_bytes = base_image.get("image")

                    image_extension = base_image.get(
                        "ext",
                        "png"
                    )

                    if not image_bytes:
                        continue

                    image_key = (
                        f"page_{page_index + 1}"
                        f"_image_{image_number}"
                    )

                    extracted_images.append(
                        {
                            "key": image_key,
                            "bytes": image_bytes,
                            "extension": image_extension,
                            "page": page_index + 1,
                            "image_number": image_number
                        }
                    )

                except Exception as e:

                    print(
                        "⚠️ Could not extract image:",
                        e
                    )

    finally:

        pdf.close()

    return extracted_images





# =====================================================
# 🧾 IMAGE MANIFEST
# =====================================================

def create_image_manifest(extracted_images):

    if not extracted_images:
        return (
            "NO IMAGES WERE SUCCESSFULLY "
            "EXTRACTED FROM THE PDF."
        )

    lines = [
        "AVAILABLE PDF IMAGE IDENTIFIERS:"
    ]

    for image in extracted_images:

        lines.append(
            f"- {image['key']} "
            f"(page {image['page']})"
        )

    return "\n".join(lines)

# =====================================================
# ☁️ UPLOAD AI ARTICLE IMAGES TO CLOUDINARY
# =====================================================

def upload_ai_article_images(extracted_images):

    uploaded_images = {}

    for image in extracted_images:

        image_key = image["key"]
        image_bytes = image["bytes"]
        extension = image.get("extension", "png")

        try:

            public_id = (
                f"candidrp/ai-articles/"
                f"{uuid.uuid4()}"
            )

            print(
                f"☁️ Uploading image: {image_key}"
            )

            upload_result = cloudinary.uploader.upload(
                io.BytesIO(image_bytes),

                public_id=public_id,

                resource_type="image",

                format=extension
            )

            uploaded_images[image_key] = {
                "url": upload_result["secure_url"],
                "public_id": upload_result["public_id"],
                "page": image["page"],
                "image_number": image["image_number"]
            }

            print(
                f"✅ Uploaded: {image_key}"
            )

            print(
                f"   URL: {upload_result['secure_url']}"
            )

            print(
                f"   Public ID: {upload_result['public_id']}"
            )

        except Exception as e:

            print(
                f"❌ Failed uploading {image_key}:",
                repr(e)
            )

            # Do NOT stop the whole article if one
            # image fails to upload.
            continue

    return uploaded_images


# =====================================================
# 🧹 CLEANUP AI ARTICLE IMAGES
# =====================================================

def cleanup_uploaded_ai_article_images(
    uploaded_images
):

    for image_data in uploaded_images.values():

        public_id = image_data.get("public_id")

        if not public_id:
            continue

        try:

            cloudinary.uploader.destroy(
                public_id,
                resource_type="image"
            )

            print(
                "🧹 Deleted orphan image:",
                public_id
            )

        except Exception as e:

            print(
                "⚠️ Failed to delete image:",
                public_id,
                e
            )
            
            
            
# =====================================================
# 🤖 AI ARTICLE PDF ANALYZER
# =====================================================

@app.post("/ai/analyze-article-pdf")
async def analyze_article_pdf(
    file: UploadFile = File(...)
):

    uploaded_images = {}

    try:

        # =================================================
        # VALIDATE FILE
        # =================================================

        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="PDF file is required"
            )

        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed"
            )

        # =================================================
        # READ PDF
        # =================================================

        pdf_bytes = await file.read()

        if not pdf_bytes:
            raise HTTPException(
                status_code=400,
                detail="PDF file is empty"
            )

        max_size = 50 * 1024 * 1024

        if len(pdf_bytes) > max_size:
            raise HTTPException(
                status_code=400,
                detail="PDF must be smaller than 50MB"
            )

        print()
        print("==========================================")
        print("📄 AI ARTICLE PDF RECEIVED")
        print("==========================================")

        print("Filename:", file.filename)
        print("Size:", len(pdf_bytes), "bytes")

        # =================================================
        # EXTRACT IMAGES
        # =================================================

        extracted_images = extract_pdf_images(
            pdf_bytes
        )

        print(
            "📸 Images detected:",
            len(extracted_images)
        )

        # =================================================
        # IMAGE MANIFEST
        # =================================================

        image_manifest = create_image_manifest(
            extracted_images
        )

        print(image_manifest)

        # =================================================
        # UPLOAD IMAGES
        # =================================================

        if extracted_images:

            uploaded_images = upload_ai_article_images(
                extracted_images
            )

        print(
            "☁️ Images uploaded:",
            len(uploaded_images)
        )

        # =================================================
        # UPLOAD PDF TO GEMINI
        # =================================================

        print("🤖 Uploading PDF to Gemini...")

        pdf_file = gemini_client.files.upload(
            file=io.BytesIO(pdf_bytes),
            config={
                "mime_type": "application/pdf",
                "display_name": file.filename
            }
        )

        print(
            "🤖 Gemini PDF:",
            pdf_file.name
        )

        # =================================================
        # FINAL PROMPT
        # =================================================

        final_prompt = f"""
{ARTICLE_AI_PROMPT}

====================================================
IMAGE MANIFEST
====================================================

{image_manifest}

====================================================
FINAL IMAGE INSTRUCTION
====================================================

Only use image identifiers that exist in the
IMAGE MANIFEST.

If an image exists visually but cannot be
confidently identified:

leave image_key empty.

Do NOT invent identifiers.

PRESERVE THE SECTION LAYOUT.

TEXT | IMAGE
=> image-right

IMAGE | TEXT
=> image-left

IMAGE | IMAGE
=> two-image

FULL WIDTH IMAGE
=> full-image
"""

        # =================================================
        # GEMINI ANALYSIS
        # =================================================

        print("🧠 Gemini analyzing article...")

        response = gemini_client.models.generate_content(
            model=GEMINI_MODEL,

            contents=[
                final_prompt,
                pdf_file
            ],

            config=types.GenerateContentConfig(

                response_mime_type="application/json",

                response_schema=AIArticle,

                max_output_tokens=30000
            )
        )

        print(
            "🧠 Gemini analysis completed."
        )

        # =================================================
        # PARSE RESPONSE
        # =================================================

        if response.parsed:

            ai_result = response.parsed

        else:

            ai_result = AIArticle.model_validate_json(
                response.text
            )

        result = ai_result.model_dump()

        print(
            "🧠 Sections:",
            len(result.get("sections", []))
        )

        # =================================================
        # BUILD CMS SECTIONS
        # =================================================

        final_sections = []

        allowed_types = {
            "text",
            "subtitle",
            "two-text",
            "image-left",
            "image-right",
            "two-image",
            "full-image"
        }

        allowed_alignments = {
            "left",
            "center",
            "right",
            "justify"
        }

        for section in result.get(
            "sections",
            []
        ):

            section_type = section.get(
                "type",
                "text"
            )

            if section_type not in allowed_types:
                section_type = "text"

            alignment = section.get(
                "alignment",
                "left"
            )

            if alignment not in allowed_alignments:
                alignment = "left"

            new_section = {

                "id": str(uuid.uuid4()),

                "type": section_type,

                "content": section.get(
                    "content",
                    ""
                ),

                "content2": section.get(
                    "content2",
                    ""
                ),

                "alignment": alignment,

                "source_page": section.get(
                    "source_page",
                    1
                ),

                "ai_generated": True,

                "image": "",
                "image_public_id": "",

                "image2": "",
                "image2_public_id": ""
            }

            # IMAGE 1

            image_key = section.get(
                "image_key",
                ""
            )

            if (
                image_key
                and image_key in uploaded_images
            ):

                image_data = uploaded_images[
                    image_key
                ]

                new_section["image"] = (
                    image_data["url"]
                )

                new_section[
                    "image_public_id"
                ] = image_data[
                    "public_id"
                ]

            # IMAGE 2

            image2_key = section.get(
                "image2_key",
                ""
            )

            if (
                image2_key
                and image2_key in uploaded_images
            ):

                image_data = uploaded_images[
                    image2_key
                ]

                new_section["image2"] = (
                    image_data["url"]
                )

                new_section[
                    "image2_public_id"
                ] = image_data[
                    "public_id"
                ]

            final_sections.append(
                new_section
            )

        # =================================================
        # RESPONSE
        # =================================================

        print()
        print("==========================================")
        print("✅ AI ARTICLE IMPORT COMPLETE")
        print("==========================================")

        return {

            "success": True,

            "filename": file.filename,

            "title": result.get(
                "title",
                ""
            ),

            "sections": final_sections,

            "images_found": len(
                extracted_images
            ),

            "images_uploaded": len(
                uploaded_images
            )
        }

    except HTTPException:

        cleanup_uploaded_ai_article_images(
            uploaded_images
        )

        raise

    except Exception as e:

        print()
        print(
            "❌ AI ARTICLE ERROR:",
            repr(e)
        )

        cleanup_uploaded_ai_article_images(
            uploaded_images
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to analyze article PDF: "
                + str(e)
            )
        )
        
        
        
@app.put("/publish-news/{id}")
def publish_news(id: str):

    try:
        object_id = ObjectId(id)

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid article ID"
        )

    result = news_collection.update_one(
        {"_id": object_id},
        {
            "$set": {
                "status": "published"
            }
        }
    )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Article not found"
        )

    return {
        "message": "Article published successfully ✅",
        "status": "published"
    }
    
    
    
    
@app.put("/publish-news/{id}")
def publish_news(id: str):

    try:
        object_id = ObjectId(id)

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid article ID"
        )

    result = news_collection.update_one(
        {"_id": object_id},
        {
            "$set": {
                "status": "published"
            }
        }
    )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Article not found"
        )

    return {
        "message": "Article published successfully ✅",
        "status": "published"
    }
