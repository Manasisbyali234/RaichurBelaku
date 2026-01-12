@echo off
echo ಸರ್ವರ್ ದೋಷ ಸರಿಪಡಿಸುವುದು...

echo 1. ಬ್ಯಾಕೆಂಡ್ ಸರ್ವರ್ ಪರೀಕ್ಷೆ...
cd backend
node -e "console.log('Node.js working'); process.exit(0);"

echo 2. MongoDB ಸಂಪರ್ಕ ಪರೀಕ್ಷೆ...
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI)
.then(() => { console.log('✓ MongoDB ಸಂಪರ್ಕ ಯಶಸ್ವಿ'); process.exit(0); })
.catch(err => { console.log('✗ MongoDB ದೋಷ:', err.message); process.exit(1); });
"

echo 3. ಸರ್ವರ್ ಪ್ರಾರಂಭಿಸುವುದು...
npm run dev

cd ..
pause