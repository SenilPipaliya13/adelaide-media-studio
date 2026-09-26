# run-engine.ps1 - Autonomous Claude Code Watcher Loop with Auto-Commit
Write-Host ">>> SP Media Co. Autonomous Engine Active..." -ForegroundColor Cyan

while ($true) {
    if (Test-Path "TASK.md") {
        $task = Get-Content "TASK.md" -Raw
        if ($task -and $task.Trim() -ne "" -and -not (Test-Path "TASK.BUSY")) {
            New-Item "TASK.BUSY" -ItemType File | Out-Null
            Write-Host "`n[!] New task detected. Claude Code executing..." -ForegroundColor Yellow
            
            # 1. Run Claude Code headlessly
            claude -p "Read CLAUDE.md and TASK.md. Execute all instructions in TASK.md, verify that 'npm run build' compiles without errors, and update STATUS.md." --allowedTools "Read,Write,Edit,Bash"
            
            # 2. Check build status & perform automated Git commit
            if ($LASTEXITCODE -eq 0) {
                Write-Host "`n[Git] Staging changes and committing..." -ForegroundColor Magenta
                git add .
                
                # Extract first line of TASK.md as the commit title
                $taskTitle = ($task -split "`r?`n" | Where-Object { $_ -match "\S" } | Select-Object -First 1) -replace "^#*\s*", ""
                if (-not $taskTitle) { $taskTitle = "automated task update" }
                
                $commitMsg = "feat: $taskTitle [$(Get-Date -Format 'yyyy-MM-dd HH:mm')]"
                git commit -m "$commitMsg"
                
                Write-Host "[OK] Committed to git: $commitMsg" -ForegroundColor Green
            }
            else {
                Write-Host "[WARN] Task execution reported an exit code of $LASTEXITCODE. Skipping auto-commit." -ForegroundColor Red
            }

            # 3. Clean up task triggers
            Remove-Item "TASK.BUSY" -Force
            Clear-Content "TASK.md"
            Write-Host "[OK] Task complete. STATUS.md updated." -ForegroundColor Green
            [System.Console]::Beep(1200, 300)
        }
    }
    Start-Sleep -Seconds 3
}