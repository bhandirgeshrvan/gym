from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config.database import Base, engine
from router import auth, gyms, members, trainers, attendance, payments, workouts, dashboard
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("gympulse")

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
        with engine.connect() as conn:
            pass
        logger.info("✅ Database connected successfully")
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        raise
    yield
    logger.info("🔌 Database disconnected")

app = FastAPI(title="GymPulse API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(gyms.router)
app.include_router(members.router)
app.include_router(trainers.router)
app.include_router(attendance.router)
app.include_router(payments.router)
app.include_router(workouts.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "GymPulse API is running"}
