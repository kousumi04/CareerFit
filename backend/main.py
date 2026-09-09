from fastapi import FastAPI

app = FastAPI(title="CareerFit API", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "CareerFit API is running"}