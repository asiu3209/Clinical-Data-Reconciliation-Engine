from fastapi import FastAPI
from app.api.reconcile import router as reconcileRouter
from app.api.validate import router as validateRouter

app = FastAPI(title="Clinical Data Reconciliation")

app.include_router(reconcileRouter, prefix="/api")
app.include_router(validateRouter, prefix="/api")
