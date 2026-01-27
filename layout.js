/**
 * DJUNTACAR - HEADER & NAVIGATION CENTRALE (Version Multilingue)
 */

document.addEventListener("DOMContentLoaded", function() {
    injectDjuntaHeader();
    injectDjuntaMenu();
    
    try { setupPWA(); } catch(e) {}
    try { checkUnreadMessages(); } catch(e) {}
    
    if (window.lucide) lucide.createIcons();
});

function injectDjuntaHeader() {
    let headerElement = document.querySelector('header');
    
    if (!headerElement) {
        headerElement = document.createElement('header');
        document.body.prepend(headerElement);
    }

    const headerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; height: 100%;">
        
        <div style="width: 30%; display: flex; justify-content: flex-start; align-items: center; gap: 5px;">
            <button onclick="toggleMenu()" style="background:none; border:none; padding:5px; cursor:pointer; outline:none;" class="active:scale-90 transition-transform">
                <i data-lucide="menu" style="width:28px; height:28px; color:#1d4379;"></i>
            </button>
            
            <div style="position: relative; display: inline-block;">
                <button onclick="toggleLangMenu()" id="lang-btn" style="background:#f8fafc; border:1px solid #f1f5f9; padding:4px 8px; border-radius:10px; cursor:pointer; font-size:10px; font-weight:900; color:#1d4379; display:flex; align-items:center; gap:2px; text-transform:uppercase;">
                    FR <i data-lucide="chevron-down" style="width:10px; height:10px;"></i>
                </button>
                <div id="lang-menu" style="display:none; position:absolute; top:35px; left:0; background:white; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.1); border:1px solid #f1f5f9; z-index:2001; min-width:60px; overflow:hidden;">
                    <button onclick="changeLang('FR')" style="width:100%; padding:10px; border:none; background:none; font-size:10px; font-weight:800; color:#1d4379; cursor:pointer; text-align:left; border-bottom:1px solid #f8fafc;">FR</button>
                    <button onclick="changeLang('EN')" style="width:100%; padding:10px; border:none; background:none; font-size:10px; font-weight:800; color:#1d4379; cursor:pointer; text-align:left; border-bottom:1px solid #f8fafc;">EN</button>
                    <button onclick="changeLang('PT')" style="width:100%; padding:10px; border:none; background:none; font-size:10px; font-weight:800; color:#1d4379; cursor:pointer; text-align:left;">PT</button>
                </div>
            </div>
        </div>

        <div style="width: 40%; display: flex; justify-content: center; align-items: center; cursor:pointer;" onclick="window.location.href='index.html'">
            <span style="font-weight:900; font-style:italic; font-size:16px; text-transform:uppercase; letter-spacing:-1px;">
                <span style="color:#1d4379;">Djunta</span><span style="color:#22c55e;">Car</span>
            </span>
        </div>

        <div style="width: 30%; display: flex; justify-content: flex-end; align-items: center; gap: 4px;">
            <button onclick="window.location.href='chat.html'" style="position:relative; background:none; border:none; padding:8px; cursor:pointer; outline:none;" class="active:scale-90 transition-transform">
                <i data-lucide="message-circle" style="width:24px; height:24px; color:#1d4379;"></i>
                <span id="unread-badge" style="display:none; position:absolute; top:5px; right:5px; width:10px; height:10px; background:#ef4444; border:2px solid white; border-radius:50%;"></span>
            </button>
            <button onclick="window.location.href='profile.html'" style="background:none; border:none; padding:8px; cursor:pointer; outline:none;" class="active:scale-90 transition-transform">
                <i data-lucide="user" style="width:24px; height:24px; color:#1d4379;"></i>
            </button>
        </div>
    </div>`;

    headerElement.innerHTML = headerHTML;
    
    Object.assign(headerElement.style, {
        height: '70px', backgroundColor: 'white', display: 'flex', alignItems: 'center',
        position: 'sticky', top:
