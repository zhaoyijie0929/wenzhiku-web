#!/bin/zsh
# ============================================================
# 军队文职智能报考平台 — 启动网站
# ============================================================
# 使用方式：双击此文件即可
# 1) 自动清理旧进程
# 2) 启动本地服务器（强制禁用缓存）
# 3) 自动打开浏览器首页
# 4) 关闭终端窗口即停止服务器
# ============================================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT=8765
HOST="127.0.0.1"
BASE_URL="http://${HOST}:${PORT}"

cd "$PROJECT_DIR" || exit 1

echo "=========================================="
echo "  军队文职智能报考平台"
echo "=========================================="
echo "项目目录：$PROJECT_DIR"
echo

# ----- 环境检查 -----
if ! command -v python3 >/dev/null 2>&1; then
  echo "❌ 未找到 python3。请先安装 Python 3。"
  read "?按回车键退出..."
  exit 1
fi

if [ ! -e "server.py" ]; then
  echo "❌ 未找到 server.py，项目文件不完整。"
  read "?按回车键退出..."
  exit 1
fi

# ----- 数据完整性检查 -----
echo "正在检查数据文件..."
FAIL_COUNT=0

if [ ! -e "data/papers.json" ]; then
  echo "❌ 未找到 data/papers.json"
  FAIL_COUNT=$((FAIL_COUNT + 1))
fi

if [ ! -d "papers" ]; then
  echo "❌ 未找到 papers 文件夹"
  FAIL_COUNT=$((FAIL_COUNT + 1))
fi

if [ "$FAIL_COUNT" -gt 0 ]; then
  echo
  echo "请确认移动硬盘已连接，且资料路径正确。"
  read "?按回车键退出..."
  exit 1
fi

echo "✅ 数据文件检查通过"

# ----- 清理旧进程 -----
echo "正在清理旧服务器进程..."
KILLED=0
for PID in $(lsof -tiTCP:$PORT -sTCP:LISTEN 2>/dev/null); do
  kill "$PID" >/dev/null 2>&1 && KILLED=$((KILLED + 1))
done
if [ "$KILLED" -gt 0 ]; then
  echo "  已终止 $KILLED 个旧进程（端口 $PORT）"
  sleep 0.5
else
  echo "  端口 $PORT 空闲，无需清理"
fi

# ----- 启动服务器 -----
echo "正在启动本地服务器（缓存已禁用）..."
python3 server.py >/tmp/jdwz-server.log 2>&1 &
SERVER_PID=$!

# 等待服务器就绪
for i in $(seq 1 10); do
  sleep 0.3
  if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    echo "❌ 服务器启动失败。日志如下："
    cat /tmp/jdwz-server.log
    read "?按回车键退出..."
    exit 1
  fi
  if curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/index.html" 2>/dev/null | grep -q "200"; then
    break
  fi
done

# ----- 自检 -----
echo
echo "正在自检页面..."
check_url() {
  local LABEL="$1"
  local URL="$2"
  local CODE
  CODE="$(curl -s -o /dev/null -w "%{http_code}" "$URL" 2>/dev/null)"
  if [ "$CODE" = "200" ]; then
    echo "  ✅ $LABEL"
    return 0
  else
    echo "  ❌ $LABEL — HTTP $CODE"
    return 1
  fi
}

FAILED=0
check_url "index.html"           "${BASE_URL}/index.html"           || FAILED=1
check_url "css/style.css"        "${BASE_URL}/css/style.css"        || FAILED=1
check_url "js/main.js"           "${BASE_URL}/js/main.js"           || FAILED=1
check_url "js/header-v2.js"      "${BASE_URL}/js/header-v2.js"      || FAILED=1
check_url "js/job-classifier.js" "${BASE_URL}/js/job-classifier.js" || FAILED=1
check_url "guide.html"          "${BASE_URL}/guide.html"          || FAILED=1
check_url "job-list.html"       "${BASE_URL}/job-list.html"       || FAILED=1
check_url "recommend.html"       "${BASE_URL}/recommend.html"       || FAILED=1
check_url "recommend-report.html" "${BASE_URL}/recommend-report.html" || FAILED=1
check_url "job-detail.html"      "${BASE_URL}/job-detail.html"      || FAILED=1
check_url "papers.html"          "${BASE_URL}/papers.html"          || FAILED=1
check_url "policy.html"          "${BASE_URL}/policy.html"          || FAILED=1
check_url "data/papers.json"     "${BASE_URL}/data/papers.json"     || FAILED=1
check_url "data/job-database.csv" "${BASE_URL}/data/job-database.csv" || FAILED=1
check_url "data/guide/process.json" "${BASE_URL}/data/guide/process.json" || FAILED=1
check_url "data/guide/exam.json" "${BASE_URL}/data/guide/exam.json" || FAILED=1

# PDF 文件检查
FIRST_PDF="$(python3 -c "
import json
with open('data/papers.json','r',encoding='utf-8') as f:
    print(json.load(f)[0]['path'])
" 2>/dev/null)"
if [ -n "$FIRST_PDF" ] && [ -f "$FIRST_PDF" ]; then
  check_url "PDF 文件" "${BASE_URL}/${FIRST_PDF}" || FAILED=1
fi

echo
if [ "$FAILED" != "0" ]; then
  echo "❌ 自检未通过（$FAILED 项失败）。"
  echo "   日志：/tmp/jdwz-server.log"
  echo "   请确认移动硬盘已连接后重试。"
  read "?按回车键退出..."
  exit 1
fi

# 验证缓存头
CACHE_HEADER="$(curl -s -I "${BASE_URL}/index.html" 2>/dev/null | grep -i 'cache-control' || true)"
if echo "$CACHE_HEADER" | grep -qi 'no-cache\|no-store'; then
  echo "✅ 缓存策略已生效"
else
  echo "⚠️  缓存策略可能未生效，请检查 server.py"
fi

# ----- 清理旧 browser 标签并打开新首页 -----
echo
echo "=========================================="
echo "  ✅ 自检全部通过"
echo "=========================================="
echo
echo "  首页：${BASE_URL}/index.html"
echo "  真题中心：${BASE_URL}/papers.html"
echo "  政策解读：${BASE_URL}/policy.html"
echo
echo "  关闭此窗口即可停止服务器。"
echo "  所有页面已禁用浏览器缓存，更新后无需手动刷新。"
echo "=========================================="
echo

# 注册清理信号
cleanup() {
  kill "$SERVER_PID" >/dev/null 2>&1
}
trap cleanup EXIT INT TERM

open "${BASE_URL}/index.html"

wait "$SERVER_PID"
