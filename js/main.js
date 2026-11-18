// Conteúdo em res/profile.json. Todo texto entra via textContent (sem innerHTML).
const COLORS = ["var(--green)", "var(--aqua)", "var(--blue)", "var(--yellow)", "var(--orange)", "var(--purple)", "var(--red)"];
const col = (i) => COLORS[i % COLORS.length];

const ARCH = String.raw`                   -\`
                  .o+\`
                 \`ooo/
                \`+oooo:
               \`+oooooo:
               -+oooooo+:
             \`/:-:++oooo+:
            \`/++++/+++++++:
           \`/++++++++++++++:
          \`/+++ooooooooooooo/\`
         ./ooosssso++osssssso+\`
        .oossssso-\`\`\`\`/ossssss+\`
       -osssssso.      :ssssssso.
      :osssssss/        osssso+++.
     /ossssssss/        +ssssooo/-
   \`/ossssso+/:-        -:/+osssso+-
  \`+sso+:-\`                 \`.-/+oso:
 \`++:.                           \`-/+/
 .\`                                 \`/`.replace(/\\`/g, "`");

const $ = (id) => document.getElementById(id);

function el(tag, props = {}, children = []) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "text") n.textContent = v;
    else if (k === "style") n.setAttribute("style", v);
    else if (k === "class") n.className = v;
    else n.setAttribute(k, v);
  }
  for (const c of [].concat(children)) if (c) n.append(c);
  return n;
}

function tagList(items, offset = 0) {
  return items.map((t, i) => el("li", { text: t, style: `color:${col(i + offset)}` }));
}

function render(p) {
  document.title = `${p.name} | Backend Java Developer`;
  $("title").textContent = `${p.handle}@${p.host}:~`;
  $("logo").textContent = ARCH;
  $("fetch-logo").textContent = ARCH;

  $("name").textContent = p.name;
  $("role").textContent = p.role;
  $("facts").replaceChildren(...tagList(p.facts));

  // fastfetch
  const rows = $("fetch-rows");
  const head = el("div", { class: "hdr" }, [
    el("span", { text: "guilherme" }),
    document.createTextNode("@"),
    el("b", { text: p.handle }),
  ]);
  rows.append(head, el("div", { class: "sep", text: "-".repeat(26) }));
  p.fetch.forEach(([k, v], i) => {
    rows.append(el("dt", { text: k, style: `color:${col(i)}` }), el("dd", { text: v }));
  });
  rows.append(el("div", { class: "pal", "aria-hidden": "true" }, COLORS.map((c) => el("i", { style: `background:${c}` }))));

  $("about").replaceChildren(...p.about.map((t) => el("p", { text: t })));

  $("projects").replaceChildren(
    ...p.projects.map((pr, i) => {
      const c = col(i);
      return el("article", { class: "card" }, [
        el("div", { class: "card-top" }, [el("span", { text: String(i + 1).padStart(2, "0"), style: `color:${c}` }), el("span", { text: pr.status })]),
        el("h3", { text: pr.name, style: `color:${c}` }),
        el("p", { text: pr.description }),
        el("ul", { class: "bl" }, pr.bullets.map((b) => el("li", { text: b }))),
        el("ul", { class: "tags" }, tagList(pr.tags, i)),
        pr.url ? el("a", { class: "go", href: pr.url, target: "_blank", rel: "noopener", text: "ver repositório →", style: `color:${c}` }) : null,
      ]);
    })
  );

  $("focus").replaceChildren(...p.focus.flatMap(([k, v], i) => [el("dt", { text: k, style: `color:${col(i)}` }), el("dd", { text: v })]));
  $("how").replaceChildren(...p.how.flatMap(([k, v], i) => [el("dt", { text: k, style: `color:${col(i)}` }), el("dd", { text: v })]));
  $("priorities").replaceChildren(
    ...p.priorities.map((t, i) => el("li", { style: `--c:${col(i + 2)}` }, [el("span", { text: t })]))
  );

  $("links").replaceChildren(
    ...p.links.map((l, i) =>
      el("li", {}, [
        el("span", { class: "lb", text: l.label, style: `color:${col(i)}` }),
        el("a", { href: l.url, text: l.value, ...(l.url.startsWith("http") ? { target: "_blank", rel: "noopener" } : {}), style: `color:${col(i)}` }),
      ])
    )
  );
  const parts = p.closing.split("·").map((s) => s.trim());
  $("closing").replaceChildren(...parts.flatMap((w, i) => [i ? el("i", { text: "·" }) : null, el("span", { text: w, style: `color:${col(i)}` })]));
  renderResume(p);
  $("year").textContent = String(new Date().getFullYear());
}

function entry(e, i) {
  return el("article", { class: "entry" }, [
    el("div", { class: "entry-head" }, [
      el("h4", {}, [el("span", { text: e.title }), e.org ? el("span", { class: "org", text: ` — ${e.org}`, style: `color:${col(i)}` }) : null]),
      el("span", { class: "period", text: e.period }),
    ]),
    e.note ? el("p", { class: "note", text: e.note }) : null,
    e.bullets ? el("ul", { class: "bl" }, e.bullets.map((b) => el("li", { text: b }))) : null,
  ]);
}

function renderResume(p) {
  const r = p.resume;
  if (!r) return;
  $("resume-name").textContent = p.name;
  $("resume-role").textContent = "Backend Java Developer";
  $("resume-place").textContent = "Indaiatuba, SP";
  $("resume-summary").textContent = r.summary;
  $("resume-exp").replaceChildren(...r.experience.map(entry));
  $("resume-edu").replaceChildren(...r.education.map(entry));

  $("resume-projects").replaceChildren(
    ...r.projects.map((pr, i) => {
      const c = col(i);
      return el("article", { class: "rproject" }, [
        el("h4", {}, [el("span", { text: pr.name, style: `color:${c}` }), pr.subtitle ? el("span", { class: "subtitle", text: ` — ${pr.subtitle}` }) : null]),
        pr.meta ? el("p", { class: "meta", text: pr.meta }) : null,
        el("ul", { class: "bl" }, pr.bullets.map((b) => el("li", { text: b }))),
        el("ul", { class: "tags" }, tagList(pr.tags, i)),
        el("p", { class: "repos" }, pr.links.map((l) => el("a", { href: l.url, target: "_blank", rel: "noopener", text: l.label, style: `color:${c}` }))),
      ]);
    })
  );

  $("resume-skills").replaceChildren(...r.skills.flatMap(([k, v], i) => [el("dt", { text: k, style: `color:${col(i)}` }), el("dd", { text: v })]));
  $("resume-certs").replaceChildren(...r.certifications.map((t) => el("li", { text: t })));
  $("resume-langs").replaceChildren(...r.languages.map(([k, v]) => el("li", {}, [el("span", { text: k }), el("span", { class: "lvl", text: v })])));
}

// ---- navegação: destaca a seção visível, menu móvel ----
function nav() {
  const links = [...document.querySelectorAll("#nav a")];
  const secs = links.map((a) => $(a.dataset.sec));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.dataset.sec === e.target.id));
      }
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );
  links[0].classList.add("on");
  secs.forEach((s) => io.observe(s));

  const btn = $("menu-btn");
  const side = document.querySelector(".sidebar");
  const close = () => { side.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); };
  btn.addEventListener("click", () => {
    const open = side.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
  links.forEach((a) => a.addEventListener("click", close));
}

// ---- boot ----
function boot() {
  const root = $("boot");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seen = false;
  try { seen = sessionStorage.getItem("booted") === "1"; } catch {}
  if (reduce || seen) { root.remove(); return; }

  const log = $("boot-log");
  const lines = [
    ["hd", "devbianchi os 1.0 (arch linux x86_64)"],
    ["", ""],
    ["ok", "[  ok  ] montando /home/guilherme"],
    ["ok", "[  ok  ] carregando perfil.json"],
    ["ok", "[  ok  ] iniciando java 21 e spring boot"],
    ["ok", "[  ok  ] conectando ao postgresql"],
    ["ok", "[  ok  ] definindo meta: trabalhar no japão"],
    ["", ""],
    ["hd", "guilherme@devbianchi:~$ ./portfolio"],
  ];
  let i = 0, done = false, timer;
  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    try { sessionStorage.setItem("booted", "1"); } catch {}
    root.classList.add("done");
    setTimeout(() => root.remove(), 450);
    removeEventListener("keydown", finish);
    root.removeEventListener("click", finish);
  };
  const step = () => {
    if (i >= lines.length) { timer = setTimeout(finish, 450); return; }
    const [cls, txt] = lines[i++];
    const row = el("span", { class: cls, text: txt });
    log.append(row, "\n");
    timer = setTimeout(step, 150);
  };
  addEventListener("keydown", finish);
  root.addEventListener("click", finish);
  step();
}

async function init() {
  boot();
  try {
    const res = await fetch("res/profile.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(res.statusText);
    render(await res.json());
  } catch (err) {
    $("name").textContent = "Não foi possível carregar o perfil";
    $("role").textContent = "Abra o site por um servidor HTTP (por exemplo python3 -m http.server) ou pelo GitHub Pages.";
    console.error(err);
  }
  nav();
}
init();
