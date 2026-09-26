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