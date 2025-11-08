@echo off
chcp 65001 >nul
echo ========================================
echo   PUSH CODE LÊN GITHUB
echo ========================================
echo.

:: Kiểm tra git đã cài chưa
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git chưa được cài đặt!
    echo Vui lòng cài Git từ: https://git-scm.com/download/win
    pause
    exit /b 1
)

:: Kiểm tra đã init git chưa
if not exist ".git" (
    echo [INFO] Đang khởi tạo git repository...
    git init
    if errorlevel 1 (
        echo [ERROR] Không thể khởi tạo git repository!
        pause
        exit /b 1
    )
    echo [OK] Đã khởi tạo git repository
    echo.
)

:: Kiểm tra remote
git remote -v >nul 2>&1
if errorlevel 1 (
    echo [INFO] Chưa có remote repository
    echo.
    echo Bạn cần tạo repository trên GitHub trước:
    echo 1. Vào https://github.com/new
    echo 2. Tạo repository mới (ví dụ: ThoiKhoaBieuPRO-PWA)
    echo 3. KHÔNG tích "Initialize with README"
    echo 4. Copy URL repository (ví dụ: https://github.com/username/ThoiKhoaBieuPRO-PWA.git)
    echo.
    set /p GITHUB_URL="Nhập URL repository GitHub: "
    if "%GITHUB_URL%"=="" (
        echo [ERROR] Bạn chưa nhập URL!
        pause
        exit /b 1
    )
    git remote add origin %GITHUB_URL%
    if errorlevel 1 (
        echo [ERROR] Không thể thêm remote!
        pause
        exit /b 1
    )
    echo [OK] Đã thêm remote: %GITHUB_URL%
    echo.
)

:: Hiển thị status
echo [INFO] Đang kiểm tra trạng thái...
git status
echo.

:: Hỏi có muốn add tất cả files không
set /p ADD_ALL="Bạn có muốn add tất cả files? (Y/N): "
if /i "%ADD_ALL%"=="Y" (
    echo [INFO] Đang add tất cả files...
    git add .
    if errorlevel 1 (
        echo [ERROR] Không thể add files!
        pause
        exit /b 1
    )
    echo [OK] Đã add tất cả files
    echo.
) else (
    echo [INFO] Bạn có thể add files thủ công bằng: git add .
    echo.
)

:: Kiểm tra có files để commit chưa
git diff --cached --quiet
if errorlevel 1 (
    echo [INFO] Có files đã được stage, sẵn sàng commit
    echo.
) else (
    git diff --quiet
    if errorlevel 1 (
        echo [WARNING] Có files chưa được add!
        echo Bạn cần chạy: git add .
        pause
        exit /b 1
    ) else (
        echo [INFO] Không có thay đổi nào để commit
        echo.
    )
)

:: Commit
set /p COMMIT_MSG="Nhập message cho commit (hoặc Enter để dùng mặc định): "
if "%COMMIT_MSG%"=="" (
    set COMMIT_MSG=feat: initial commit - Thời khóa biểu PRO PWA
)
echo [INFO] Đang commit...
git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo [ERROR] Không thể commit!
    echo Có thể bạn chưa config git user:
    echo   git config --global user.name "Your Name"
    echo   git config --global user.email "your.email@example.com"
    pause
    exit /b 1
)
echo [OK] Đã commit thành công
echo.

:: Push
echo [INFO] Đang push lên GitHub...
echo.
set /p BRANCH="Nhập tên branch (mặc định: main): "
if "%BRANCH%"=="" set BRANCH=main

git branch -M %BRANCH% 2>nul
git push -u origin %BRANCH%
if errorlevel 1 (
    echo [ERROR] Không thể push!
    echo.
    echo Có thể bạn cần:
    echo 1. Kiểm tra kết nối internet
    echo 2. Kiểm tra quyền truy cập GitHub
    echo 3. Đăng nhập GitHub: gh auth login
    echo 4. Hoặc sử dụng Personal Access Token
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   THÀNH CÔNG!
echo ========================================
echo Code đã được push lên GitHub thành công!
echo.
pause

