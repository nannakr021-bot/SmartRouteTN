# SmartRoute TN

A beginner-friendly college bus management website prototype for an Engineering Marathon.

## Features

- Student dashboard with bus cards
- Route filter
- Available-seat calculation
- Route stops and sample arrival times
- On Time / Delayed / Completed status
- Staff demo panel for changing status
- Staff demo panel for publishing announcements
- Saves demo changes in the current browser with `localStorage`
- Responsive layout for mobile and desktop

## Important limitations

This is a front-end prototype. Bus information is fictional sample data. It does **not** include live GPS, real traffic data, online ticketing, secure staff authentication, or a shared cloud database. `localStorage` changes are stored only in the current browser on the current device.

Do not use it for real student personal information or real transport operations.

## Run with VS Code

1. Download and extract the project ZIP.
2. Open the `SmartRouteTN` folder in Visual Studio Code.
3. Open `index.html`.
4. If you have the **Live Server** extension installed, right-click `index.html` and choose **Open with Live Server**. Otherwise, open `index.html` in your browser.
5. Edit `style.css` for appearance and `app.js` for behaviour.

No npm install or build command is required.

## Publish with GitHub Pages

1. Sign in to GitHub and create a new repository, for example `smartroute-tn`.
2. Upload `index.html`, `style.css`, `app.js`, and `README.md` to the repository root.
3. In the repository, open **Settings → Pages**.
4. Under build/deployment, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then save.
6. Wait for GitHub Pages to publish the site. Open the URL shown in the Pages section.

GitHub's interface can change; follow the current Pages instructions shown in repository settings.

## Suggested team roles

- Member 1: HTML/CSS and responsive design
- Member 2: JavaScript, bus data and calculations
- Member 3 (if available): testing, README and presentation

## Future upgrades

- Real staff authentication and role permissions
- Shared database such as Firebase
- GPS integration with permission from the college/bus operator
- Real traffic-aware arrival estimates
- Map using Leaflet and OpenStreetMap with proper attribution
