@echo off
cd /d D:\PGCN\PGCN\pgcn-app\
start cmd /k "npm run dev"

cd /d D:\PGCN\PGCN\pgcn-app\Backend\
start cmd /k "node server.js"
