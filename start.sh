#!/bin/bash
uvicorn app.infer_api:app --reload --host 0.0.0.0 --port 8000
