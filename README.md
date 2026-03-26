# Money Empire Telegram Mini App (Frontend Only)

A premium Telegram Mini App with modern card-based UI, multi-theme support, and comprehensive earning features. **No backend required - everything runs in the browser with localStorage.**

## Features

- **Modern UI**: Card-based design with smooth animations
- **Multi-Theme**: Light, Green, and Orange themes (no dark mode as requested)
- **Currencies**: Coin, USDT, and Star
- **Earning System**:
  - Social media tasks
  - Daily tasks
  - Offerwall integration
  - Rewarded ads
- **Referral System**: Milestone rewards and leaderboard
- **Gamification**: Daily spin wheel, streaks, levels
- **Withdrawal System**: USDT TRC20/ERC20 support with Star-based fees
- **Local Storage**: All data persists in browser
- **Telegram Integration**: WebApp SDK with user authentication

## Quick Setup

### 1. Install Dependencies (Optional)

```bash
npm install
```

### 2. Telegram Bot Setup

1. Create a bot with @BotFather on Telegram
2. Get your bot token
3. Set up the Mini App:
   - Go to your bot settings
   - Add Mini App with URL pointing to your hosted app

### 3. Run Locally

```bash
npm start
```

This will start a local server at http://localhost:3000

## File Structure

```
money-empire-app/
├── index.html              # Main HTML file
├── style.css               # Styles and themes
├── app.js                  # Main application logic
├── package.json            # Project dependencies
├── assets/                 # Images and static files
│   ├── banner1.jpg
│   ├── banner2.jpg
│   ├── banner3.jpg
│   └── default-avatar.png
└── README.md               # This file
```

## Technologies Used

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Storage**: Browser localStorage
- **Integration**: Telegram WebApp SDK
- **Styling**: CSS Grid, Flexbox, CSS Variables for theming

## How It Works

- **No Backend**: All data is stored locally in the browser
- **Demo Mode**: Works without Telegram for testing
- **Persistence**: User data survives browser refreshes
- **Offline**: App works without internet connection

## Deployment

Simply upload all files to any web server or static hosting service:

- GitHub Pages
- Netlify
- Vercel
- Any web server

## Demo Features

- **Sample Tasks**: Pre-loaded tasks for each category
- **Mock Leaderboard**: Simulated top users
- **Local Transactions**: All transaction history stored locally
- **Demo Withdrawals**: Withdrawal simulation (no real crypto transfers)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

### 4. Deploy Functions

```bash
firebase deploy --only functions
```

### 5. Telegram Bot Setup

1. Create a bot with @BotFather on Telegram
2. Get your bot token
3. Set up the Mini App:
   - Go to your bot settings
   - Add Mini App with URL pointing to your hosted app

### 6. Database Setup

Run the following in Firebase Console > Firestore to create initial data:

```javascript
// Sample tasks
db.collection('tasks').add({
    title: 'Follow us on Twitter',
    description: 'Follow our Twitter account and retweet the pinned post',
    type: 'social',
    reward: 50,
    currency: 'Coin',
    completed: false
});

// Sample milestones
db.collection('milestones').add({
    referrals: 5,
    description: 'Invite 5 friends',
    reward: 100,
    currency: 'Coin'
});
```

## File Structure

```
money-empire-app/
├── index.html              # Main HTML file
├── style.css               # Styles and themes
├── app.js                  # Main application logic
├── package.json            # Project dependencies
├── firebase.json           # Firebase configuration
├── firestore.rules         # Firestore security rules
├── functions/              # Firebase Cloud Functions
│   ├── index.js
│   └── package.json
├── assets/                 # Images and static files
│   ├── banner1.jpg
│   ├── banner2.jpg
│   ├── banner3.jpg
│   └── default-avatar.png
└── README.md               # This file
```

## Technologies Used

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Firebase (Auth, Firestore, Functions)
- **Integration**: Telegram WebApp SDK
- **Styling**: CSS Grid, Flexbox, CSS Variables for theming

## Security Features

- Telegram WebApp authentication
- Firebase security rules
- Anti-cheat validation
- Input sanitization

## Development

### Local Development

```bash
# Start local server
npm start

# Start Firebase emulators
firebase emulators:start
```

### Building for Production

```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy functions
firebase deploy --only functions
```

## Admin Panel

To create an admin panel, you can build a separate web app that connects to the same Firebase project with admin privileges. The admin can:

- Manage tasks and rewards
- View withdrawal requests
- Monitor user activity
- Update milestones

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.