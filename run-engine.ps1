# run-engine.ps1 - Autonomous Background Engine
Write-Host ">>> SP Media Co. Autonomous Engine Active & Listening..." -ForegroundColor Cyan

while ($true) {
    if (Test-Path "TASK.md") {
        $task = Get-Content "TASK.md" -Raw
        if ($task -and $task.Trim() -ne "" -and -not (Test-Path "TASK.BUSY")) {
            New-Item "TASK.BUSY" -ItemType File | Out-Null
            Write-Host "`n[!] New task detected in TASK.md. Claude Code executing..." -ForegroundColor Yellow
            
            # 1. Run Claude Code headlessly with kebab-case bypass flag
            claude -p "Read CLAUDE.md and TASK.md. Execute all instructions in TASK.md, verify that 'npm run build' compiles without errors, and update STATUS.md." --dangerously-skip-permissions
            
            # 2. Check build status, commit changes, and push to GitHub
            if ($LASTEXITCODE -eq 0) {
                Write-Host "`n[Git] Staging changes and committing..." -ForegroundColor Magenta
                git add .
                
                $taskTitle = ($task -split "`r?`n" | Where-Object { $_ -match "\S" } | Select-Object -First 1) -replace "^#*\s*", ""
                if (-not $taskTitle) { $taskTitle = "automated task update" }
                
                $commitMsg = "feat: $taskTitle [$(Get-Date -Format 'yyyy-MM-dd HH:mm')]"
                git commit -m "$commitMsg"
                
                Write-Host "[Git] Pushing updates to GitHub..." -ForegroundColor Cyan
                git push origin main
                
                Write-Host "[OK] Committed and pushed live: $commitMsg" -ForegroundColor Green
            }
            else {
                Write-Host "[WARN] Claude reported an error (Exit code: $LASTEXITCODE). Skipping commit/push." -ForegroundColor Red
            }

            # 3. Clean up and listen
            Remove-Item "TASK.BUSY" -Force
            Clear-Content "TASK.md"
            Write-Host "[OK] Ready for next task. Listening..." -ForegroundColor Green
            [System.Console]::Beep(1200, 300)
        }
    }
    Start-Sleep -Seconds 3
}