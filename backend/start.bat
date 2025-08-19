@echo off
echo Starting PolicyBridge AI Django Backend...
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install requirements if needed
echo Installing requirements...
pip install -r requirements.txt

REM Create logs directory if it doesn't exist
if not exist "logs" mkdir logs

REM Run migrations
echo Running database migrations...
python manage.py makemigrations
python manage.py migrate

REM Start the server
echo Starting Django development server...
echo Backend will be available at: http://localhost:8000
echo Admin interface: http://localhost:8000/admin
echo.
python manage.py runserver

pause
