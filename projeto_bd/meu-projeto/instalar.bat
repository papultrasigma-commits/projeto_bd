@echo off
echo =========================================
echo A instalar dependencias da Bricoloja...
echo =========================================
echo.
echo 1. A instalar o Backend...
cd backend
call npm install
cd ..
echo.
echo 2. A instalar o Frontend...
cd frontend
call npm install
cd ..
echo.
echo =========================================
echo Instalacao concluida com sucesso!
echo =========================================
pause