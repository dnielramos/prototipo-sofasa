# Script para convertir todos los componentes de forms a tema claro premium
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
        
        # Fix borders
        $content = $content -replace 'border-zinc-800', 'border-gray-200'
        
        # Fix list card backgrounds
        $content = $content -replace 'bg-zinc-900/50', 'bg-white'
        
        # Fix list card borders (specific pattern)
        $content = $content -replace 'border border-zinc-800', 'border-2 border-gray-200'
        
        # Fix heading colors
        $content = $content -replace 'text-zinc-400(">|\s)', 'text-gray-700$1'
        
        # Fix title/name colors
        $content = $content -replace 'text-white(">|\s)', 'text-gray-900$1'
        
        # Fix description text colors  
        $content = $content -replace 'text-zinc-500', 'text-gray-600'
        
        # Fix hover borders
        $content = $content -replace 'hover:border-zinc-700', 'hover:border-sofasa-blue-200 hover:shadow-md'
        
        # Fix rounded corners
        $content = $content -replace '(class="[^"]*p-4[^"]*) rounded-lg', '$1 rounded-xl'
        
        # Fix padding in list cards
        $content = $content -replace 'class="p-4 bg-white border-2', 'class="p-5 bg-white border-2'
        
        # Save the file
        Set-Content -Path $file -Value $content -NoNewline
        
        Write-Host "Fixed: $component" -ForegroundColor Green
    }
}

Write-Host "`nAll components updated successfully!" -ForegroundColor Cyan
