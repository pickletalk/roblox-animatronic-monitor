param($jobId)

$placeId = "137167142636546"
# Launch Roblox to connect to specified server
Start-Process "roblox-player:1+launchmode:play+gameinfo:PLACEID=$placeId+JOBID=$jobId"
