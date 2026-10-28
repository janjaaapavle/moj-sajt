
const sekcije = document.querySelectorAll(
    "section, #usluge article"
);

sekcije.forEach((sekcija) => {
    sekcija.classList.add("reveal");
});

const posmatrac = new IntersectionObserver((zapisi) => {
    zapisi.forEach((zapis) => {
        if (zapis.isIntersecting) {
            zapis.target.classList.add("visible");
            posmatrac.unobserve(zapis.target);
        }
    });
}, {
    threshold: 0.15
});

sekcije.forEach((sekcija) => {
    posmatrac.observe(sekcija);
});

const platno = document.createElement("canvas");
platno.id = "plave-tackice";
document.body.prepend(platno);

const ctx = platno.getContext("2d");

let sirina = 0;
let visina = 0;
let tackice = [];
let animacija = null;

const smanjenoKretanje = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

function podesiPlatno() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    sirina = window.innerWidth;
    visina = window.innerHeight;

    platno.width = sirina * dpr;
    platno.height = visina * dpr;
    platno.style.width = sirina + "px";
    platno.style.height = visina + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const brojTackica = Math.min(
        65,
        Math.floor((sirina * visina) / 14000)
    );

    tackice = Array.from(
        { length: brojTackica },
        () => ({
            x: Math.random() * sirina,
            y: Math.random() * visina,
            r: Math.random() * 2 + 0.7,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5,
            sjaj: Math.random() * 0.5 + 0.3
        })
    );
}

function crtajTackice() {
    ctx.clearRect(0, 0, sirina, visina);

    for (const t of tackice) {
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45, 145, 255, ${t.sjaj})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#1683ff";
        ctx.fill();

        t.x += t.dx;
        t.y += t.dy;

        if (t.x < 0) t.x = sirina;
        if (t.x > sirina) t.x = 0;
        if (t.y < 0) t.y = visina;
        if (t.y > visina) t.y = 0;
    }

    ctx.shadowBlur = 0;
    animacija = requestAnimationFrame(crtajTackice);
}

podesiPlatno();

if (!smanjenoKretanje) {
    crtajTackice();
}

window.addEventListener("resize", podesiPlatno);

function pustiKlikZvuk() {
    const audio = new AudioContext();
    const oscilator = audio.createOscillator();
    const jacina = audio.createGain();

    oscilator.type = "sine";
    oscilator.frequency.setValueAtTime(650, audio.currentTime);
    oscilator.frequency.exponentialRampToValueAtTime(
        950,
        audio.currentTime + 0.08
    );

    jacina.gain.setValueAtTime(0.04, audio.currentTime);
    jacina.gain.exponentialRampToValueAtTime(
        0.001,
        audio.currentTime + 0.12
    );

    oscilator.connect(jacina);
    jacina.connect(audio.destination);

    oscilator.start();
    oscilator.stop(audio.currentTime + 0.12);

    oscilator.onended = () => audio.close();
}

document.querySelectorAll("a, button").forEach((dugme) => {
    dugme.addEventListener("click", () => {
        pustiKlikZvuk();
    });
});
