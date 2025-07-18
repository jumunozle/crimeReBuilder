from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from reconstructor import reconstruct_obj

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    file_location = f"./images/{file.filename}"
    with open(file_location, "wb") as f:
        shutil.copyfileobj(file.file, f)

    obj_path = reconstruct_obj(file_location)

    return {"message": "Reconstrucción completada", "obj_path": obj_path}



@app.get("/get_obj/")
def get_obj():
    return FileResponse("./output/resultado.obj")
