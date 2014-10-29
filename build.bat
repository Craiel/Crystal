@echo off

echo.
echo -----------------------
echo Building
echo.

"Build\Release\CrystalBuild.exe" -p clientConfig.json -d
"Build\Release\CrystalBuild.exe" -p serverConfig.json -d
