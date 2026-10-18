// SmartRoute TN - beginner-friendly demo using sample data.
// This is a front-end prototype. It does not use live GPS or a shared database.

const DEFAULT_BUSES = [
  {
    id: "BUS-01",
    routeId: "R1",
    routeName: "Route A · Tambaram",
    totalSeats: 40,
    occupiedSeats: 28,
    totalStops: 6,
    remainingStops: 3,
    departure: "7:30 AM",
    arrival: "8:30 AM",
    status: "On Time",
    note: "Expected at college gate by 8:30 AM",
    stops: ["Tambaram", "Perungalathur", "Vandalur", "Urapakkam", "Guduvanchery", "College Gate"]
  },
  {
    id: "BUS-02",
    routeId: "R1",
    routeName: "Route A · Tambaram",
    totalSeats: 40,
    occupiedSeats: 34,
    totalStops: 6,
    remainingStops: 4,
    departure: "7:40 AM",
    arrival: "8:45 AM",
    status: "Delayed",
    note: "Sample delay: expected at 8:45 AM",
    stops: ["Tambaram", "Perungalathur", "Vandalur", "Urapakkam", "Guduvanchery", "College Gate"]
  },
  {
    id: "BUS-03",
    routeId: "R2",
    routeName: "Route B · Guindy",
    totalSeats: 35,
    occupiedSeats: 20,
    totalStops: 5,
    remainingStops: 2,
    departure: "7:20 AM",
    arrival: "8:20 AM",
    status: "On Time",
    note: "Expected at college gate by 8:20 AM",
    stops: ["Guindy", "Alandur", "Pallavaram", "Chromepet", "College Gate"]
  }
];

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: "A1",
    busId: "BUS-02",
    title: "Sample delay notice",
    message: "BUS-02 is running late in this demonstration. Sample expected arrival: 8:45 AM.",
    createdAt: "Demo announcement"
  }
];

const STORAGE_KEYS = {
  buses: "smartroute-tn-buses-v1",
  announcements: "smartroute-tn-announcements-v1"
};

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function loadSavedData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : cloneData(fallback);
  } catch (error) {
    console.warn("Could not load saved demo data. Using defaults.", error);
    return cloneData(fallback);
  }
}

let buses = loadSavedData(STORAGE_KEYS.buses, DEFAULT_BUSES);
let announcements = loadSavedData(STORAGE_KEYS.announcements, DEFAULT_ANNOUNCEMENTS);
let selectedBusId = buses[0]?.id ?? null;

const routeFilter = document.getElementById("route-filter");
const busList = document.getElementById("bus-list");
const stopList = document.getElementById("stop-list");
const stopsTitle = document.getElementById("stops-title");
const announcementList = document.getElementById("announcement-list");
const studentView = document.getElementById("student-view");
const adminView = document.getElementById("admin-view");

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEYS.buses, JSON.stringify(buses));
    localStorage.setItem(STORAGE_KEYS.announcements, JSON.stringify(announcements));
  } catch (error) {
    console.warn("The browser could not save demo data.", error);
  }
}

function getAvailableSeats(bus) {
  return Math.max(0, bus.totalSeats - bus.occupiedSeats);
}

function getStatusClass(status) {
  if (status === "Delayed") return "delayed";
  if (status === "Completed") return "completed";
  return "on-time";
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function populateRouteFilter() {
  const previousValue = routeFilter.value || "all";
  const routes = [...new Map(buses.map(bus => [bus.routeId, bus.routeName])).entries()];

  routeFilter.replaceChildren();
  routeFilter.append(new Option("All routes", "all"));

  routes.forEach(([routeId, routeName]) => {
    routeFilter.append(new Option(routeName, routeId));
  });

  routeFilter.value = routes.some(([id]) => id === previousValue) ? previousValue : "all";
}

function populateAdminBusOptions() {
  ["admin-bus", "announcement-bus"].forEach(id => {
    const select = document.getElementById(id);
    const previousValue = select.value;
    select.replaceChildren();

    buses.forEach(bus => {
      select.append(new Option(`${bus.id} — ${bus.routeName}`, bus.id));
    });

    if (buses.some(bus => bus.id === previousValue)) {
      select.value = previousValue;
    }
  });
}

function renderStats(visibleBuses) {
  document.getElementById("stat-buses").textContent = visibleBuses.length;
  document.getElementById("stat-seats").textContent =
    visibleBuses.reduce((sum, bus) => sum + getAvailableSeats(bus), 0);
  document.getElementById("stat-alerts").textContent = announcements.length;
}

function renderBuses() {
  const routeId = routeFilter.value;
  const visibleBuses = buses.filter(bus => routeId === "all" || bus.routeId === routeId);

  renderStats(visibleBuses);
  busList.replaceChildren();

  if (visibleBuses.length === 0) {
    busList.append(createElement("div", "empty-state", "No buses found for this route."));
    renderStops(null);
    return;
  }

  visibleBuses.forEach(bus => {
    const available = getAvailableSeats(bus);
    const card = createElement("article", `bus-card${bus.id === selectedBusId ? " selected" : ""}`);
    const top = createElement("div", "bus-card-top");
    const titleGroup = createElement("div");
    titleGroup.append(
      createElement("h3", "bus-number", bus.id),
      createElement("p", "route-name", bus.routeName)
    );
    top.append(titleGroup, createElement("span", `status ${getStatusClass(bus.status)}`, bus.status));

    const metrics = createElement("div", "bus-metrics");
    const seats = createElement("div", "metric");
    seats.append(createElement("span", "","Seats available"), createElement("strong", "", `${available} / ${bus.totalSeats}`));
    const arrival = createElement("div", "metric");
    arrival.append(createElement("span", "", "Expected arrival"), createElement("strong", "", bus.arrival || "Not set"));
    metrics.append(seats, arrival);

    const bar = createElement("div", "seat-bar");
    const fill = createElement("span");
    fill.style.width = `${Math.min(100, (available / bus.totalSeats) * 100)}%`;
    bar.append(fill);

    const bottom = createElement("div", "card-bottom");
    bottom.append(createElement("span", "", `${bus.remainingStops} stops remaining`));
    const details = createElement("button", "text-btn", bus.id === selectedBusId ? "Selected ✓" : "View stops →");
    details.type = "button";
    details.addEventListener("click", () => {
      selectedBusId = bus.id;
      renderBuses();
      renderStops(bus);
    });
    bottom.append(details);

    card.append(top, metrics, bar, bottom);
    busList.append(card);
  });

  const selectedBus = visibleBuses.find(bus => bus.id === selectedBusId) || visibleBuses[0];
  selectedBusId = selectedBus.id;
  renderStops(selectedBus);
}

function renderStops(bus) {
  stopList.replaceChildren();

  if (!bus) {
    stopsTitle.textContent = "Route stops";
    stopList.append(createElement("li", "", "Choose a route to see stops."));
    return;
  }

  stopsTitle.textContent = `${bus.id} · Route stops`;
  bus.stops.forEach((stop, index) => {
    const item = createElement("li", "", stop);
    const small = createElement("small", "", index === 0 ? `Departure ${bus.departure}` :
      index === bus.stops.length - 1 ? `Arrival ${bus.arrival}` : `Stop ${index + 1}`);
    item.append(small);
    stopList.append(item);
  });
}

function renderAnnouncements() {
  announcementList.replaceChildren();

  if (announcements.length === 0) {
    announcementList.append(createElement("div", "empty-state", "No announcements at the moment."));
    return;
  }

  announcements.forEach(item => {
    const wrapper = createElement("article", "announcement");
    wrapper.append(createElement("div", "announcement-icon", "📢"));
    const content = createElement("div");
    content.append(
      createElement("h3", "", `${item.title} · ${item.busId}`),
      createElement("p", "", item.message),
      createElement("small", "", item.createdAt)
    );
    wrapper.append(content);
    announcementList.append(wrapper);
  });
}

function renderAll() {
  populateRouteFilter();
  populateAdminBusOptions();
  renderBuses();
  renderAnnouncements();
}

function showView(viewName) {
  const showAdmin = viewName === "admin";
  studentView.classList.toggle("hidden", showAdmin);
  adminView.classList.toggle("hidden", !showAdmin);

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });
}

document.querySelectorAll(".nav-btn").forEach(button => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

routeFilter.addEventListener("change", () => {
  selectedBusId = null;
  renderBuses();
});

document.getElementById("status-form").addEventListener("submit", event => {
  event.preventDefault();

  const busId = document.getElementById("admin-bus").value;
  const status = document.getElementById("admin-status").value;
  const arrival = document.getElementById("admin-arrival").value.trim();
  const bus = buses.find(item => item.id === busId);

  if (!bus) return;

  bus.status = status;
  if (arrival) bus.arrival = arrival;
  bus.note = arrival || bus.note;
  saveData();
  renderAll();
  document.getElementById("status-feedback").textContent = `${bus.id} status updated in this browser.`;
});

document.getElementById("announcement-form").addEventListener("submit", event => {
  event.preventDefault();

  const busId = document.getElementById("announcement-bus").value;
  const title = document.getElementById("announcement-title").value.trim();
  const message = document.getElementById("announcement-message").value.trim();

  if (!title || !message) return;

  announcements.unshift({
    id: `A${Date.now()}`,
    busId,
    title,
    message,
    createdAt: `Added ${new Date().toLocaleString()} (demo)`
  });
  announcements = announcements.slice(0, 10);
  saveData();
  renderAll();
  event.target.reset();
  document.getElementById("announcement-feedback").textContent = "Announcement published on this browser.";
});

document.getElementById("reset-demo").addEventListener("click", () => {
  const confirmed = window.confirm("Reset all SmartRoute TN demo changes in this browser?");
  if (!confirmed) return;

  buses = cloneData(DEFAULT_BUSES);
  announcements = cloneData(DEFAULT_ANNOUNCEMENTS);
  selectedBusId = buses[0]?.id ?? null;
  saveData();
  renderAll();
  document.getElementById("status-feedback").textContent = "";
  document.getElementById("announcement-feedback").textContent = "";
});

document.getElementById("year").textContent = new Date().getFullYear();
renderAll();
