from fastapi import FastAPI
from routes.analysis import router as analysis_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Perplexity Prism API",
    description="Backend API for Perplexity Prism - support clarity and citation mapping",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Or ["*"] for dev, but specify for production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Register routes
app.include_router(analysis_router)

@app.get("/")
async def root():
    return {"message": "Welcome to Perplexity Prism API"}
