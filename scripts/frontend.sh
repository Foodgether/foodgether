echo "Building Front End"
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
cd frontend
npm install
export VITE_BASE_PATH=/foodgether && npm run build
