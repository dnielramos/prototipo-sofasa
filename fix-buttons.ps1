# Fix buttons across all form components
$componentsToFix = @(
    "ideas-form",
    "tareas-form",
    "situaciones-form",
    "ausentismos-form",
    "proyeccion-form",
    "controles-form"
)

$formsPath = "c:\dev\prototipo-sofasa\src\app\features\dashboard\components\forms"

foreach ($component in $componentsToFix) {
    $file = Join-Path $formsPath "$component\$component.component.ts"
    
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Fix button styling
        $content = $content -replace 'bg-white text-black hover:bg-zinc-200 transition shadow-lg shadow-white/5', 'bg-gradient-to-r from-sofasa-blue-500 to-sofasa-blue-600 text-white hover:from-sofasa-blue-600 hover:to-sofasa-blue-700 hover:shadow-blue-glow-lg transition-all duration-200 shadow-lg disabled:hover:shadow-lg'
        
        # Fix button size
        $content = $content -replace 'px-5 py-2\.5 rounded-lg', 'px-6 py-3 rounded-xl'
        
        # Fix button font weight
        $content = $content -replace 'text-sm font-medium', 'text-sm font-semibold'
        
        # Save the file
        Set-Content -Path $file -Value $content -NoNewline
        
        Write-Host "Fixed buttons in: $component" -ForegroundColor Green
    }
}

Write-Host "`nAll button styles updated!" -ForegroundColor Cyan
