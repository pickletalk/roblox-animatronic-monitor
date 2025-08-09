-- Detector.lua (Put into your bot’s autoexec directory)
local HttpService = game:GetService("HttpService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local WEBHOOK = "https://discord.com/api/webhooks/1403702581104218153/k_yKYW6971_qADkSO6iuOjj7AIaXIfQuVcIs0mZIpNWJAc_cORIf0ieSDBlN8zibbHi-"

local function notify()
  local payload = HttpService:JSONEncode({
    content = "✅ **Radioactive Foxy** found in server **" .. game.JobId .. "**!"
  })
  HttpService:PostAsync(WEBHOOK, payload, Enum.HttpContentType.ApplicationJson)
end

for _, obj in ipairs(ReplicatedStorage:GetDescendants()) do
  if obj.Name:lower():find("radioactive foxy") then
    notify()
    break
  end
end
