// Diese Funktion ändert die Sichtbarkeit des Sidebar-Menüs basierend auf dem Authentifizierungsstatus.
function toggleSidebarMenu(user) {
    const sidebarMenu = document.getElementById('sidebarMenu');
    if (user) {
        sidebarMenu.style.visibility = "visible";
    } else {
        sidebarMenu.style.visibility = "hidden";
    }
}