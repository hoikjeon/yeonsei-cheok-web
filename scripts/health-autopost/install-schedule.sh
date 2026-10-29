#!/bin/zsh
# 이 Mac에서 건강정보 자동 작성을 매일 07:30, 15:30에 실행하도록 등록합니다.
# 스크립트는 앞으로 3일치(매일 09:00) 빈 칸을 채우므로, Mac이 하루 이틀 꺼져 있어도 발행은 이어집니다.
# Mac이 잠자기 중이었으면 깨어날 때 놓친 실행을 한 번 합니다.
#
# 등록: npm run health:autopost:install
# 해제: npm run health:autopost:uninstall

set -euo pipefail

LABEL="com.ys-cheok.health-autopost"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
NODE_DIR="$(dirname "$(command -v node)")"

if [[ "${1:-}" == "uninstall" ]]; then
  launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
  rm -f "$PLIST"
  echo "자동 작성 일정을 해제했습니다."
  exit 0
fi

mkdir -p "$HOME/Library/LaunchAgents" "$REPO/logs/health-autopost"

cat > "$PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/zsh</string>
    <string>-c</string>
    <string>cd "$REPO" &amp;&amp; npm run health:autopost</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key><string>$NODE_DIR:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin</string>
  </dict>
  <key>StartCalendarInterval</key>
  <array>
    <dict><key>Hour</key><integer>7</integer><key>Minute</key><integer>30</integer></dict>
    <dict><key>Hour</key><integer>15</integer><key>Minute</key><integer>30</integer></dict>
  </array>
  <key>StandardOutPath</key><string>$REPO/logs/health-autopost/launchd.log</string>
  <key>StandardErrorPath</key><string>$REPO/logs/health-autopost/launchd.log</string>
</dict>
</plist>
PLIST

launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
echo "등록했습니다: 매일 07:30, 15:30에 자동 작성이 실행됩니다."
echo "실행 기록: $REPO/logs/health-autopost/"
