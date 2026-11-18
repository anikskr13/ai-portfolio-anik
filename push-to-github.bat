@echo off
title Push AI Portfolio to GitHub
echo ========================================================
echo        PUSHING CODE TO GITHUB (anikskr13/ai-portfolio-anik)
echo ========================================================
echo.

cd /d "%~dp0"
echo Pushing branch 'main' to origin...
git push -u origin main

echo.
if %errorlevel% equ 0 (
    echo ========================================================
    echo SUCCESS! Your code is now live on GitHub:
    echo https://github.com/anikskr13/ai-portfolio-anik
    echo ========================================================
) else (
    echo.
    echo If prompted, please sign in with your GitHub account.
)

pause
