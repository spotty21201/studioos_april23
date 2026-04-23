`<!-- Notes & Activity -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Notes &amp; Activity - AIM StudioOS</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-surface": "#171c20",
                        "on-tertiary-fixed-variant": "#633f0f",
                        "on-primary": "#ffffff",
                        "surface-variant": "#dfe3e8",
                        "surface-alt": "#F1EFEA",
                        "primary-container": "#2f5e7a",
                        "secondary-container": "#e1dfdb",
                        "text-secondary": "#68707A",
                        "text-primary": "#1F2428",
                        "surface-container-low": "#f0f4f9",
                        "tint-critical": "#F8EEEC",
                        "status-positive": "#3D7A57",
                        "outline-variant": "#c1c7cd",
                        "on-secondary": "#ffffff",
                        "secondary": "#5f5e5b",
                        "on-tertiary-container": "#fec68b",
                        "primary-fixed": "#c7e7ff",
                        "tint-positive": "#EEF5F0",
                        "status-critical": "#A65A4D",
                        "surface-container": "#eaeef4",
                        "inverse-surface": "#2c3135",
                        "secondary-fixed-dim": "#c8c6c2",
                        "surface": "#FFFFFF",
                        "inverse-on-surface": "#edf1f6",
                        "on-error": "#ffffff",
                        "on-error-container": "#93000a",
                        "on-primary-container": "#a8d6f7",
                        "secondary-fixed": "#e4e2dd",
                        "surface-bright": "#f6faff",
                        "inverse-primary": "#9fccec",
                        "status-warning": "#B07A2A",
                        "surface-tint": "#35637f",
                        "primary": "#114661",
                        "tint-info": "#EEF4F8",
                        "border-subtle": "#E4E7EB",
                        "surface-container-highest": "#dfe3e8",
                        "on-primary-fixed-variant": "#184b66",
                        "surface-container-high": "#e4e9ee",
                        "text-tertiary": "#98A0A8",
                        "on-surface-variant": "#41484d",
                        "on-tertiary": "#ffffff",
                        "on-secondary-fixed-variant": "#474744",
                        "surface-container-lowest": "#ffffff",
                        "error-container": "#ffdad6",
                        "surface-dim": "#d6dae0",
                        "on-secondary-container": "#63635f",
                        "on-tertiary-fixed": "#2b1700",
                        "background": "#F7F6F3",
                        "tertiary": "#5e3a0a",
                        "primary-fixed-dim": "#9fccec",
                        "on-background": "#171c20",
                        "on-secondary-fixed": "#1b1c19",
                        "outline": "#71787e",
                        "tertiary-fixed": "#ffddbb",
                        "error": "#ba1a1a",
                        "tertiary-container": "#795120",
                        "tint-warning": "#FBF5EA",
                        "on-primary-fixed": "#001e2e",
                        "tertiary-fixed-dim": "#f3bc81"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "item-gap": "12px",
                        "sub-section-gap": "16px",
                        "canvas-max-width": "1440px",
                        "page-padding": "32px",
                        "section-gap": "24px"
                    },
                    "fontFamily": {
                        "table-header": ["Inter"],
                        "page-title": ["Inter"],
                        "body": ["Inter"],
                        "section-title": ["Inter"],
                        "card-metric": ["Inter"],
                        "metadata": ["Inter"]
                    },
                    "fontSize": {
                        "table-header": ["12px", { "lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600" }],
                        "page-title": ["30px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                        "body": ["14px", { "lineHeight": "1.6", "fontWeight": "400" }],
                        "section-title": ["18px", { "lineHeight": "1.4", "fontWeight": "600" }],
                        "card-metric": ["32px", { "lineHeight": "1", "fontWeight": "600" }],
                        "metadata": ["12px", { "lineHeight": "1.4", "fontWeight": "500" }]
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-background font-body text-text-primary antialiased min-h-screen flex">
<!-- SideNavBar Component -->
<nav class="h-screen w-64 fixed left-0 top-0 border-r border-[#E4E7EB] dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col py-8 px-4 z-50">
<div class="mb-8 px-2">
<div class="text-lg font-bold tracking-tighter text-[#2F5E7A] dark:text-zinc-100">AIM StudioOS</div>
<div class="font-['Inter'] antialiased tracking-tight text-zinc-800 dark:text-zinc-200 text-sm opacity-70">Executive Briefing</div>
</div>
<div class="flex flex-col space-y-1">
<a class="flex items-center px-3 py-2 rounded-md text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined mr-3 text-[20px]">dashboard</span>
                Dashboard
            </a>
<a class="flex items-center px-3 py-2 rounded-md text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined mr-3 text-[20px]">architecture</span>
                Projects
            </a>
<a class="flex items-center px-3 py-2 rounded-md text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined mr-3 text-[20px]">payments</span>
                Finance
            </a>
<a class="flex items-center px-3 py-2 rounded-md text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined mr-3 text-[20px]">description</span>
                Documents
            </a>
<a class="flex items-center px-3 py-2 rounded-md text-[#2F5E7A] dark:text-sky-400 font-semibold bg-zinc-50 dark:bg-zinc-900/50 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined mr-3 text-[20px]" style="font-variation-settings: 'FILL' 1;">history_edu</span>
                Notes &amp; Activity
            </a>
<a class="flex items-center px-3 py-2 rounded-md text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80 mt-auto" href="#">
<span class="material-symbols-outlined mr-3 text-[20px]">settings</span>
                Settings
            </a>
</div>
</nav>
<!-- Main Wrapper to offset SideNav -->
<div class="ml-64 flex-1 flex flex-col min-h-screen">
<!-- TopNavBar Component -->
<header class="sticky top-0 z-40 w-full border-b border-[#E4E7EB] dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-8 h-16">
<div class="flex items-center">
<span class="material-symbols-outlined text-zinc-500 mr-2 text-[20px]">search</span>
<input class="bg-transparent border-none focus:ring-0 font-['Inter'] text-sm font-medium w-64 text-[#2F5E7A] dark:text-sky-400 placeholder-zinc-400 outline-none" placeholder="Search across workspace..." type="text"/>
</div>
<div class="flex items-center space-x-6">
<span class="material-symbols-outlined cursor-pointer text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all ease-in-out duration-150 text-[20px]">notifications</span>
<span class="material-symbols-outlined cursor-pointer text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all ease-in-out duration-150 text-[20px]">account_circle</span>
</div>
</header>
<!-- Canvas Content -->
<main class="flex-1 p-page-padding w-full max-w-canvas-max-width mx-auto">
<!-- Page Header -->
<div class="flex justify-between items-end mb-section-gap">
<div>
<h1 class="font-page-title text-page-title text-text-primary tracking-tight">Notes &amp; Activity</h1>
</div>
<button class="bg-primary text-on-primary px-4 py-2 rounded-md font-metadata text-metadata flex items-center gap-2 hover:bg-surface-tint transition-colors">
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">add</span>
                    New Memo
                </button>
</div>
<!-- Two Column Layout -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-section-gap items-start">
<!-- Left Column: Strategic Notes Feed -->
<div class="lg:col-span-8 flex flex-col gap-sub-section-gap">
<!-- Note Card 1 -->
<article class="bg-surface border border-border-subtle rounded-lg p-6 flex flex-col gap-item-gap">
<div class="flex justify-between items-start">
<h2 class="font-section-title text-section-title text-text-primary">Phase 2 Schematic Design Review</h2>
<span class="font-metadata text-metadata text-text-tertiary whitespace-nowrap ml-4">Today, 09:41 AM</span>
</div>
<p class="font-body text-body text-text-secondary">
                            Following the preliminary executive review, we need to adjust the baseline timeline for the structural engineering phase. The current density parameters require additional sub-surface evaluation before we can lock the podium design.
                        </p>
<div class="flex items-center justify-between mt-2 pt-4 border-t border-border-subtle/50">
<div class="flex items-center gap-3">
<img alt="Author Avatar" class="w-8 h-8 rounded-full object-cover border border-border-subtle" data-alt="Professional headshot of an executive architect in a bright modern studio setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjO-5A9Gkt73ZsBZPl4-ccDn5FkIWVgKLaFBqnT9OFYTI-f8PMqRMkX8uDHC3hNwpAD9TIXNnHcarCoq5tmZQPbssZiw-rsbFeqYKs38AQxc5kwpgX939VXwgyJjqCqDI7fPC3ZFnOGSqLczlcNQFliPLGV4zvAkfQKuiGZ8SMth52r3Crjyt9yDbWp5fIX3xq7hOnm_4bAYZjt6KXv6r4WhZNWNCaSBfaUNEI0-ZEXvHuNe27cqnnbd0Pv0qzBLiXjeL7M9RECTw"/>
<span class="font-metadata text-metadata text-text-primary">Elena Rostova</span>
</div>
<div class="flex gap-2">
<span class="px-2.5 py-1 bg-surface-container-low text-text-secondary rounded font-metadata text-[11px] uppercase tracking-wider">Strategy</span>
<span class="px-2.5 py-1 bg-tint-info text-primary rounded font-metadata text-[11px] uppercase tracking-wider">Project Alpha</span>
</div>
</div>
</article>
<!-- Note Card 2 -->
<article class="bg-surface border border-border-subtle rounded-lg p-6 flex flex-col gap-item-gap">
<div class="flex justify-between items-start">
<h2 class="font-section-title text-section-title text-text-primary">Q3 Budget Allocation Update</h2>
<span class="font-metadata text-metadata text-text-tertiary whitespace-nowrap ml-4">Yesterday, 14:20 PM</span>
</div>
<p class="font-body text-body text-text-secondary">
                            Contingency funds have been re-allocated to cover the expanded material sourcing scope for the facade. We are currently tracking 4% under the revised hard cap, but remain cautious on glazing lead times.
                        </p>
<div class="flex items-center justify-between mt-2 pt-4 border-t border-border-subtle/50">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center font-metadata text-metadata font-bold border border-primary/10">MR</div>
<span class="font-metadata text-metadata text-text-primary">Marcus Reed</span>
</div>
<div class="flex gap-2">
<span class="px-2.5 py-1 bg-surface-container-low text-text-secondary rounded font-metadata text-[11px] uppercase tracking-wider">Finance</span>
</div>
</div>
</article>
<!-- Note Card 3 -->
<article class="bg-surface border border-border-subtle rounded-lg p-6 flex flex-col gap-item-gap">
<div class="flex justify-between items-start">
<h2 class="font-section-title text-section-title text-text-primary">Vendor Contracting Risk Assessment</h2>
<span class="font-metadata text-metadata text-text-tertiary whitespace-nowrap ml-4">Oct 12, 10:05 AM</span>
</div>
<p class="font-body text-body text-text-secondary">
                            Legal has flagged clause 4.2 in the prime contractor agreement regarding liability for weather delays. We recommend holding the signature until the indemnification language is softened. See attached revised brief in Document Center.
                        </p>
<div class="flex items-center justify-between mt-2 pt-4 border-t border-border-subtle/50">
<div class="flex items-center gap-3">
<img alt="Author Avatar" class="w-8 h-8 rounded-full object-cover border border-border-subtle" data-alt="Professional headshot of a corporate legal advisor in a sharp suit against a neutral background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzuQR6-isMNV3DSn1Z_Be5aRTZW4ko7A9AuhIdtMmFSLct92tRjRUBK8kV8d1R-Q1G9Y4APDNbyBJG74aK88W4uf73Bt0LAWYxjXyz_CsLQhbD875E3VD7Ny3G_MtjpvpYk5YImePLGih8jtfdKcmYfFib0nGbt0P4Z5c22LLv1PUjQsfN6ds8U20NURnIj6aKzNYOjihT8-tqPIkHncxRKtlooAIB7UTUfetNJ57FWhKo8DrySr2d6xA_g5q6vilnm3G1twUDGU8"/>
<span class="font-metadata text-metadata text-text-primary">David Chen</span>
</div>
<div class="flex gap-2">
<span class="px-2.5 py-1 bg-tint-critical text-status-critical rounded font-metadata text-[11px] uppercase tracking-wider">Legal Hold</span>
</div>
</div>
</article>
</div>
<!-- Right Column: System Activity Log -->
<div class="lg:col-span-4 bg-surface border border-border-subtle rounded-lg p-6 sticky top-[104px]">
<h2 class="font-section-title text-section-title text-text-primary mb-6">System Activity</h2>
<div class="relative before:absolute before:inset-0 before:ml-3 before:-translate-x-px md:before:translate-x-0 before:h-full before:w-[2px] before:bg-border-subtle">
<!-- Log Item -->
<div class="relative flex items-start gap-4 mb-6 group">
<div class="w-6 h-6 rounded-full bg-surface border-2 border-primary-container flex items-center justify-center shrink-0 z-10 mt-0.5">
<span class="material-symbols-outlined text-[12px] text-primary-container">upload</span>
</div>
<div class="flex flex-col">
<p class="font-body text-body text-text-primary"><span class="font-medium">Elena Rostova</span> uploaded <span class="font-medium text-primary">Master_Plan_v2.pdf</span></p>
<span class="font-metadata text-metadata text-text-tertiary mt-1">10 mins ago</span>
</div>
</div>
<!-- Log Item -->
<div class="relative flex items-start gap-4 mb-6 group">
<div class="w-6 h-6 rounded-full bg-surface border-2 border-border-subtle flex items-center justify-center shrink-0 z-10 mt-0.5 group-hover:border-primary-container transition-colors">
<span class="material-symbols-outlined text-[12px] text-text-secondary group-hover:text-primary-container transition-colors">edit_note</span>
</div>
<div class="flex flex-col">
<p class="font-body text-body text-text-primary"><span class="font-medium">Marcus Reed</span> revised the budget for <span class="font-medium text-primary">Project Alpha</span></p>
<span class="font-metadata text-metadata text-text-tertiary mt-1">2 hours ago</span>
</div>
</div>
<!-- Log Item -->
<div class="relative flex items-start gap-4 mb-6 group">
<div class="w-6 h-6 rounded-full bg-surface border-2 border-status-positive flex items-center justify-center shrink-0 z-10 mt-0.5">
<span class="material-symbols-outlined text-[12px] text-status-positive">check_circle</span>
</div>
<div class="flex flex-col">
<p class="font-body text-body text-text-primary"><span class="font-medium">David Chen</span> approved contract <span class="font-medium text-primary">VEN-2023-08</span></p>
<span class="font-metadata text-metadata text-text-tertiary mt-1">Yesterday, 16:45 PM</span>
</div>
</div>
<!-- Log Item -->
<div class="relative flex items-start gap-4 mb-6 group">
<div class="w-6 h-6 rounded-full bg-surface border-2 border-border-subtle flex items-center justify-center shrink-0 z-10 mt-0.5 group-hover:border-primary-container transition-colors">
<span class="material-symbols-outlined text-[12px] text-text-secondary group-hover:text-primary-container transition-colors">person_add</span>
</div>
<div class="flex flex-col">
<p class="font-body text-body text-text-primary">System granted access to <span class="font-medium text-primary">External Contractor DB</span></p>
<span class="font-metadata text-metadata text-text-tertiary mt-1">Yesterday, 09:00 AM</span>
</div>
</div>
<!-- Log Item -->
<div class="relative flex items-start gap-4 group">
<div class="w-6 h-6 rounded-full bg-surface border-2 border-border-subtle flex items-center justify-center shrink-0 z-10 mt-0.5 group-hover:border-primary-container transition-colors">
<span class="material-symbols-outlined text-[12px] text-text-secondary group-hover:text-primary-container transition-colors">folder_open</span>
</div>
<div class="flex flex-col">
<p class="font-body text-body text-text-primary"><span class="font-medium">System Admin</span> created new directory <span class="font-medium text-primary">/Archive/2022</span></p>
<span class="font-metadata text-metadata text-text-tertiary mt-1">Oct 11, 14:30 PM</span>
</div>
</div>
</div>
<button class="w-full mt-6 py-2 text-center font-metadata text-metadata text-primary hover:text-primary-container hover:bg-surface-container-low rounded transition-colors">
                        View Full Audit Log
                    </button>
</div>
</div>
</main>
</div>
</body></html>

<!-- Settings -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Settings - AIM StudioOS</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-surface": "#171c20",
                        "on-tertiary-fixed-variant": "#633f0f",
                        "on-primary": "#ffffff",
                        "surface-variant": "#dfe3e8",
                        "surface-alt": "#F1EFEA",
                        "primary-container": "#2f5e7a",
                        "secondary-container": "#e1dfdb",
                        "text-secondary": "#68707A",
                        "text-primary": "#1F2428",
                        "surface-container-low": "#f0f4f9",
                        "tint-critical": "#F8EEEC",
                        "status-positive": "#3D7A57",
                        "outline-variant": "#c1c7cd",
                        "on-secondary": "#ffffff",
                        "secondary": "#5f5e5b",
                        "on-tertiary-container": "#fec68b",
                        "primary-fixed": "#c7e7ff",
                        "tint-positive": "#EEF5F0",
                        "status-critical": "#A65A4D",
                        "surface-container": "#eaeef4",
                        "inverse-surface": "#2c3135",
                        "secondary-fixed-dim": "#c8c6c2",
                        "surface": "#FFFFFF",
                        "inverse-on-surface": "#edf1f6",
                        "on-error": "#ffffff",
                        "on-error-container": "#93000a",
                        "on-primary-container": "#a8d6f7",
                        "secondary-fixed": "#e4e2dd",
                        "surface-bright": "#f6faff",
                        "inverse-primary": "#9fccec",
                        "status-warning": "#B07A2A",
                        "surface-tint": "#35637f",
                        "primary": "#114661",
                        "tint-info": "#EEF4F8",
                        "border-subtle": "#E4E7EB",
                        "surface-container-highest": "#dfe3e8",
                        "on-primary-fixed-variant": "#184b66",
                        "surface-container-high": "#e4e9ee",
                        "text-tertiary": "#98A0A8",
                        "on-surface-variant": "#41484d",
                        "on-tertiary": "#ffffff",
                        "on-secondary-fixed-variant": "#474744",
                        "surface-container-lowest": "#ffffff",
                        "error-container": "#ffdad6",
                        "surface-dim": "#d6dae0",
                        "on-secondary-container": "#63635f",
                        "on-tertiary-fixed": "#2b1700",
                        "background": "#F7F6F3",
                        "tertiary": "#5e3a0a",
                        "primary-fixed-dim": "#9fccec",
                        "on-background": "#171c20",
                        "on-secondary-fixed": "#1b1c19",
                        "outline": "#71787e",
                        "tertiary-fixed": "#ffddbb",
                        "error": "#ba1a1a",
                        "tertiary-container": "#795120",
                        "tint-warning": "#FBF5EA",
                        "on-primary-fixed": "#001e2e",
                        "tertiary-fixed-dim": "#f3bc81"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "item-gap": "12px",
                        "sub-section-gap": "16px",
                        "canvas-max-width": "1440px",
                        "page-padding": "32px",
                        "section-gap": "24px"
                    },
                    "fontFamily": {
                        "table-header": ["Inter"],
                        "page-title": ["Inter"],
                        "body": ["Inter"],
                        "section-title": ["Inter"],
                        "card-metric": ["Inter"],
                        "metadata": ["Inter"]
                    },
                    "fontSize": {
                        "table-header": ["12px", { "lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600" }],
                        "page-title": ["30px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                        "body": ["14px", { "lineHeight": "1.6", "fontWeight": "400" }],
                        "section-title": ["18px", { "lineHeight": "1.4", "fontWeight": "600" }],
                        "card-metric": ["32px", { "lineHeight": "1", "fontWeight": "600" }],
                        "metadata": ["12px", { "lineHeight": "1.4", "fontWeight": "500" }]
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-background text-text-primary font-body text-body antialiased min-h-screen flex">
<!-- SideNavBar -->
<nav class="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r border-border-subtle bg-white dark:bg-zinc-950 flex-col h-full py-8 px-4 font-['Inter'] antialiased tracking-tight text-zinc-800 dark:text-zinc-200 z-50">
<div class="mb-8 px-4">
<h1 aria-label="AIM StudioOS Logo" class="text-lg font-bold tracking-tighter text-[#2F5E7A] dark:text-zinc-100">AIM StudioOS</h1>
<p class="font-metadata text-metadata text-text-secondary mt-1">Executive Briefing</p>
</div>
<div class="flex-1 flex flex-col gap-2 mt-4">
<a class="flex items-center gap-3 px-4 py-2 rounded text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span>Dashboard</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 rounded text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined" data-icon="architecture">architecture</span>
<span>Projects</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 rounded text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined" data-icon="payments">payments</span>
<span>Finance</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 rounded text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined" data-icon="description">description</span>
<span>Documents</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 rounded text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined" data-icon="history_edu">history_edu</span>
<span>Notes &amp; Activity</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 rounded text-[#2F5E7A] dark:text-sky-400 font-semibold bg-zinc-50 dark:bg-zinc-900/50 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span>Settings</span>
</a>
</div>
</nav>
<!-- Main Content Area -->
<div class="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen">
<!-- TopNavBar -->
<header class="sticky top-0 z-40 w-full border-b border-border-subtle bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md font-['Inter'] text-sm font-medium flex items-center justify-between px-8 h-16 ml-0 md:ml-64">
<div class="flex items-center gap-4">
<span class="md:hidden text-base font-bold text-zinc-900 dark:text-zinc-50">AIM StudioOS</span>
</div>
<div class="flex items-center gap-4 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all ease-in-out duration-150 cursor-pointer">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
<span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</div>
</header>
<!-- Canvas -->
<main class="flex-1 p-page-padding max-w-canvas-max-width mx-auto w-full">
<div class="mb-section-gap">
<h2 class="font-page-title text-page-title text-text-primary">Settings</h2>
<p class="font-body text-body text-text-secondary mt-1">Manage your principal-level configuration and preferences.</p>
</div>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-section-gap">
<!-- Settings Navigation (Bento style left col) -->
<div class="lg:col-span-3 flex flex-col gap-2">
<button class="flex items-center justify-between w-full text-left px-4 py-3 bg-white border border-border-subtle rounded-DEFAULT shadow-sm text-primary font-medium hover:bg-surface-alt transition-colors">
<span>Profile Settings</span>
<span class="material-symbols-outlined text-sm">chevron_right</span>
</button>
<button class="flex items-center justify-between w-full text-left px-4 py-3 bg-transparent border border-transparent rounded-DEFAULT text-text-secondary font-medium hover:bg-surface-alt transition-colors">
<span>Notifications</span>
<span class="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100">chevron_right</span>
</button>
<button class="flex items-center justify-between w-full text-left px-4 py-3 bg-transparent border border-transparent rounded-DEFAULT text-text-secondary font-medium hover:bg-surface-alt transition-colors">
<span>Dashboard Display</span>
<span class="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100">chevron_right</span>
</button>
<button class="flex items-center justify-between w-full text-left px-4 py-3 bg-transparent border border-transparent rounded-DEFAULT text-text-secondary font-medium hover:bg-surface-alt transition-colors">
<span>Security</span>
<span class="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100">chevron_right</span>
</button>
</div>
<!-- Settings Content (Main col) -->
<div class="lg:col-span-9 flex flex-col gap-section-gap">
<!-- Profile Basics Card -->
<section class="bg-surface border border-border-subtle rounded-lg p-6">
<div class="flex items-center justify-between mb-sub-section-gap pb-4 border-b border-border-subtle">
<h3 class="font-section-title text-section-title text-text-primary">Profile Basics</h3>
<button class="text-primary font-metadata text-metadata uppercase tracking-wider hover:underline">Edit</button>
</div>
<div class="flex items-start gap-8">
<div class="relative group cursor-pointer">
<img alt="Executive Portrait" class="w-24 h-24 rounded-full object-cover border border-border-subtle" data-alt="professional corporate headshot of executive in modern bright office environment soft natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAci-qYKROqVvJ280RMwDssv8JWa9NItIPS5I-CnHbtm6NPanUP4YuZYq1djxq8sFGvAblSphxYGxnfHxj6rg_YaBHkp-O0UU950o6uULrXOkvSIfnEhty-icaGCIPJd4p2mvXNOmFANHsUdJdYQ3uhKzo1hfxR_ugrr6G5E4lYPTUgtOJ9HSnAtRQfFe4I9Q_P8NRv-_XoLlRNxfaHQrMfl69_p4TVv286pWmGY5xRgI4TglqVXw-VBoyBoz2_WTuoc-7Hb4j9Vs"/>
<div class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
<span class="material-symbols-outlined text-white" data-icon="photo_camera">photo_camera</span>
</div>
</div>
<div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-item-gap">
<div>
<label class="block font-metadata text-metadata text-text-secondary mb-1">Full Name</label>
<input class="w-full bg-surface-container-low border border-transparent rounded px-3 py-2 text-text-primary font-body text-body focus:outline-none cursor-default" readonly="" type="text" value="Alexander Vance"/>
</div>
<div>
<label class="block font-metadata text-metadata text-text-secondary mb-1">Title</label>
<input class="w-full bg-surface-container-low border border-transparent rounded px-3 py-2 text-text-primary font-body text-body focus:outline-none cursor-default" readonly="" type="text" value="Managing Principal"/>
</div>
<div class="md:col-span-2">
<label class="block font-metadata text-metadata text-text-secondary mb-1">Email Address</label>
<input class="w-full bg-surface-container-low border border-transparent rounded px-3 py-2 text-text-primary font-body text-body focus:outline-none cursor-default" readonly="" type="email" value="a.vance@aimstudio.com"/>
</div>
</div>
</div>
</section>
<!-- Preferences Split Row -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-section-gap">
<!-- Notification Preferences -->
<section class="bg-surface border border-border-subtle rounded-lg p-6">
<div class="mb-sub-section-gap">
<h3 class="font-section-title text-section-title text-text-primary">Notification Preferences</h3>
<p class="font-metadata text-metadata text-text-secondary mt-1">Configure email and digest alerts.</p>
</div>
<div class="space-y-4">
<label class="flex items-center justify-between cursor-pointer group">
<div>
<span class="block font-body text-body text-text-primary">Daily Briefing</span>
<span class="block font-metadata text-metadata text-text-secondary">Summary of active projects &amp; finances</span>
</div>
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-10 h-5 bg-border-subtle rounded-full peer peer-checked:bg-primary transition-colors"></div>
<div class="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-5"></div>
</div>
</label>
<div class="h-px bg-border-subtle w-full"></div>
<label class="flex items-center justify-between cursor-pointer group">
<div>
<span class="block font-body text-body text-text-primary">Critical Approvals</span>
<span class="block font-metadata text-metadata text-text-secondary">Immediate alerts for financial sign-offs</span>
</div>
<div class="relative">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-10 h-5 bg-border-subtle rounded-full peer peer-checked:bg-primary transition-colors"></div>
<div class="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-5"></div>
</div>
</label>
<div class="h-px bg-border-subtle w-full"></div>
<label class="flex items-center justify-between cursor-pointer group">
<div>
<span class="block font-body text-body text-text-primary">Document Mentions</span>
<span class="block font-metadata text-metadata text-text-secondary">When tagged in notes or briefs</span>
</div>
<div class="relative">
<input class="sr-only peer" type="checkbox"/>
<div class="w-10 h-5 bg-border-subtle rounded-full peer peer-checked:bg-primary transition-colors"></div>
<div class="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-5"></div>
</div>
</label>
</div>
</section>
<!-- Dashboard Display -->
<section class="bg-surface border border-border-subtle rounded-lg p-6">
<div class="mb-sub-section-gap">
<h3 class="font-section-title text-section-title text-text-primary">Dashboard Display</h3>
<p class="font-metadata text-metadata text-text-secondary mt-1">Adjust executive view parameters.</p>
</div>
<div class="space-y-4">
<div>
<label class="block font-metadata text-metadata text-text-primary mb-2">Default Currency Display</label>
<div class="flex gap-2">
<button class="flex-1 py-2 border border-primary bg-tint-info text-primary rounded font-metadata text-metadata text-center transition-colors">USD ($)</button>
<button class="flex-1 py-2 border border-border-subtle text-text-secondary rounded font-metadata text-metadata text-center hover:bg-surface-alt transition-colors">EUR (€)</button>
<button class="flex-1 py-2 border border-border-subtle text-text-secondary rounded font-metadata text-metadata text-center hover:bg-surface-alt transition-colors">GBP (£)</button>
</div>
</div>
<div class="pt-2">
<label class="block font-metadata text-metadata text-text-primary mb-2">Fiscal Year Alignment</label>
<select class="w-full bg-white border border-border-subtle rounded px-3 py-2 text-text-primary font-body text-body focus:outline-none focus:border-primary appearance-none cursor-pointer">
<option>Calendar Year (Jan - Dec)</option>
<option>Q1 Start (Apr - Mar)</option>
<option>Q3 Start (Oct - Sep)</option>
</select>
</div>
</div>
</section>
</div>
<!-- Action Footer -->
<div class="flex justify-end pt-4">
<button class="px-6 py-2 bg-primary text-on-primary rounded font-metadata text-metadata uppercase tracking-wide hover:bg-primary-container transition-colors">Save Changes</button>
</div>
</div>
</div>
</main>
</div>
</body></html>

<!-- Finance Overview -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Finance Overview - AIM StudioOS</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-surface": "#171c20",
                        "on-tertiary-fixed-variant": "#633f0f",
                        "on-primary": "#ffffff",
                        "surface-variant": "#dfe3e8",
                        "surface-alt": "#F1EFEA",
                        "primary-container": "#2f5e7a",
                        "secondary-container": "#e1dfdb",
                        "text-secondary": "#68707A",
                        "text-primary": "#1F2428",
                        "surface-container-low": "#f0f4f9",
                        "tint-critical": "#F8EEEC",
                        "status-positive": "#3D7A57",
                        "outline-variant": "#c1c7cd",
                        "on-secondary": "#ffffff",
                        "secondary": "#5f5e5b",
                        "on-tertiary-container": "#fec68b",
                        "primary-fixed": "#c7e7ff",
                        "tint-positive": "#EEF5F0",
                        "status-critical": "#A65A4D",
                        "surface-container": "#eaeef4",
                        "inverse-surface": "#2c3135",
                        "secondary-fixed-dim": "#c8c6c2",
                        "surface": "#FFFFFF",
                        "inverse-on-surface": "#edf1f6",
                        "on-error": "#ffffff",
                        "on-error-container": "#93000a",
                        "on-primary-container": "#a8d6f7",
                        "secondary-fixed": "#e4e2dd",
                        "surface-bright": "#f6faff",
                        "inverse-primary": "#9fccec",
                        "status-warning": "#B07A2A",
                        "surface-tint": "#35637f",
                        "primary": "#114661",
                        "tint-info": "#EEF4F8",
                        "border-subtle": "#E4E7EB",
                        "surface-container-highest": "#dfe3e8",
                        "on-primary-fixed-variant": "#184b66",
                        "surface-container-high": "#e4e9ee",
                        "text-tertiary": "#98A0A8",
                        "on-surface-variant": "#41484d",
                        "on-tertiary": "#ffffff",
                        "on-secondary-fixed-variant": "#474744",
                        "surface-container-lowest": "#ffffff",
                        "error-container": "#ffdad6",
                        "surface-dim": "#d6dae0",
                        "on-secondary-container": "#63635f",
                        "on-tertiary-fixed": "#2b1700",
                        "background": "#F7F6F3",
                        "tertiary": "#5e3a0a",
                        "primary-fixed-dim": "#9fccec",
                        "on-background": "#171c20",
                        "on-secondary-fixed": "#1b1c19",
                        "outline": "#71787e",
                        "tertiary-fixed": "#ffddbb",
                        "error": "#ba1a1a",
                        "tertiary-container": "#795120",
                        "tint-warning": "#FBF5EA",
                        "on-primary-fixed": "#001e2e",
                        "tertiary-fixed-dim": "#f3bc81"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "item-gap": "12px",
                        "sub-section-gap": "16px",
                        "canvas-max-width": "1440px",
                        "page-padding": "32px",
                        "section-gap": "24px"
                    },
                    "fontFamily": {
                        "table-header": ["Inter"],
                        "page-title": ["Inter"],
                        "body": ["Inter"],
                        "section-title": ["Inter"],
                        "card-metric": ["Inter"],
                        "metadata": ["Inter"]
                    },
                    "fontSize": {
                        "table-header": ["12px", { "lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600" }],
                        "page-title": ["30px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                        "body": ["14px", { "lineHeight": "1.6", "fontWeight": "400" }],
                        "section-title": ["18px", { "lineHeight": "1.4", "fontWeight": "600" }],
                        "card-metric": ["32px", { "lineHeight": "1", "fontWeight": "600" }],
                        "metadata": ["12px", { "lineHeight": "1.4", "fontWeight": "500" }]
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        /* Subtle ambient shadow for top level cards as requested */
        .ambient-shadow {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }
    </style>
</head>
<body class="bg-background text-text-primary antialiased font-body flex min-h-screen">
<!-- SideNavBar Component -->
<nav class="h-screen w-64 fixed left-0 top-0 border-r border-[#E4E7EB] dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col py-8 px-4 z-50 font-['Inter'] antialiased tracking-tight text-zinc-800 dark:text-zinc-200">
<!-- Header -->
<div class="mb-10 px-4">
<h1 class="text-lg font-bold tracking-tighter text-[#2F5E7A] dark:text-zinc-100">AIM StudioOS</h1>
<p class="text-xs text-zinc-500 font-medium mt-1">Executive Briefing</p>
</div>
<!-- Navigation Tabs -->
<div class="flex flex-col gap-1">
<a class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span>Dashboard</span>
</a>
<a class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined">architecture</span>
<span>Projects</span>
</a>
<!-- Active Tab: Finance -->
<a class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#2F5E7A] dark:text-sky-400 font-semibold bg-zinc-50 dark:bg-zinc-900/50 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">payments</span>
<span>Finance</span>
</a>
<a class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined">description</span>
<span>Documents</span>
</a>
<a class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined">history_edu</span>
<span>Notes &amp; Activity</span>
</a>
<a class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined">settings</span>
<span>Settings</span>
</a>
</div>
</nav>
<!-- Main Layout Area (offset by sidebar) -->
<div class="ml-64 flex-1 flex flex-col min-w-0">
<!-- TopNavBar Component -->
<header class="sticky top-0 z-40 w-full border-b border-[#E4E7EB] dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-8 h-16">
<div class="flex items-center flex-1">
<div class="relative w-64">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" style="font-size: 18px;">search</span>
<input class="w-full bg-surface-container-low border-none rounded-full py-1.5 pl-10 pr-4 font-['Inter'] text-sm font-medium text-text-primary focus:ring-2 focus:ring-primary-container focus:outline-none placeholder:text-text-tertiary" placeholder="Search..." type="text"/>
</div>
</div>
<div class="flex items-center gap-5 text-[#2F5E7A] dark:text-sky-400">
<span class="material-symbols-outlined cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-all ease-in-out duration-150">notifications</span>
<span class="material-symbols-outlined cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-all ease-in-out duration-150">account_circle</span>
</div>
</header>
<!-- Canvas Content -->
<main class="flex-1 p-page-padding w-full max-w-canvas-max-width mx-auto flex flex-col gap-section-gap">
<!-- Page Header -->
<div class="flex items-end justify-between">
<div>
<h2 class="font-page-title text-page-title text-text-primary">Finance</h2>
<p class="font-body text-body text-text-secondary mt-1">Q3 Operational Overview</p>
</div>
<button class="bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-body text-body px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 font-medium">
<span class="material-symbols-outlined" style="font-size: 18px;">add</span>
                    Create Invoice
                </button>
</div>
<!-- Summary Cards Grid -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-item-gap">
<!-- Card 1: Receivables -->
<div class="bg-surface border border-border-subtle rounded-xl p-sub-section-gap ambient-shadow flex flex-col">
<div class="flex items-center gap-2 mb-3">
<span class="material-symbols-outlined text-text-tertiary" style="font-size: 18px;">account_balance_wallet</span>
<h3 class="font-metadata text-metadata text-text-secondary uppercase">Total Receivables</h3>
</div>
<div class="font-card-metric text-card-metric text-text-primary mb-2">$1,245,000</div>
<div class="flex items-center gap-1 mt-auto pt-2 border-t border-border-subtle/50">
<span class="w-2 h-2 rounded-full bg-status-critical"></span>
<span class="font-metadata text-metadata text-status-critical">$240K Overdue</span>
</div>
</div>
<!-- Card 2: Payables -->
<div class="bg-surface border border-border-subtle rounded-xl p-sub-section-gap ambient-shadow flex flex-col">
<div class="flex items-center gap-2 mb-3">
<span class="material-symbols-outlined text-text-tertiary" style="font-size: 18px;">outbox</span>
<h3 class="font-metadata text-metadata text-text-secondary uppercase">Total Payables</h3>
</div>
<div class="font-card-metric text-card-metric text-text-primary mb-2">$450,200</div>
<div class="flex items-center gap-1 mt-auto pt-2 border-t border-border-subtle/50">
<span class="font-metadata text-metadata text-text-secondary">Due within 30 days</span>
</div>
</div>
<!-- Card 3: Operating Cash -->
<div class="bg-surface border border-border-subtle rounded-xl p-sub-section-gap ambient-shadow flex flex-col">
<div class="flex items-center gap-2 mb-3">
<span class="material-symbols-outlined text-text-tertiary" style="font-size: 18px;">savings</span>
<h3 class="font-metadata text-metadata text-text-secondary uppercase">Operating Cash</h3>
</div>
<div class="font-card-metric text-card-metric text-text-primary mb-2">$3,820,000</div>
<div class="flex items-center gap-1 mt-auto pt-2 border-t border-border-subtle/50">
<span class="material-symbols-outlined text-status-positive" style="font-size: 14px;">trending_up</span>
<span class="font-metadata text-metadata text-status-positive">+5.2% vs last month</span>
</div>
</div>
</div>
<!-- Middle Section: Subtle Bar Chart & Quick Stats -->
<div class="bg-surface border border-border-subtle rounded-xl p-sub-section-gap">
<div class="flex items-center justify-between mb-6">
<h3 class="font-section-title text-section-title text-text-primary">Invoice Performance</h3>
<span class="font-metadata text-metadata text-text-secondary">Year to Date</span>
</div>
<!-- Simulated Stacked Bar Chart -->
<div class="flex flex-col gap-3">
<div class="flex items-center justify-between font-metadata text-metadata mb-1">
<span class="text-text-secondary">Collection Status</span>
<span class="text-text-primary font-medium">$4.5M Total Billed</span>
</div>
<!-- The Bar -->
<div class="h-4 w-full bg-surface-container-low rounded-full overflow-hidden flex">
<div class="h-full bg-status-positive opacity-80" style="width: 70%;" title="Collected"></div>
<div class="h-full bg-status-warning opacity-60" style="width: 20%;" title="Pending"></div>
<div class="h-full bg-status-critical opacity-70" style="width: 10%;" title="Overdue"></div>
</div>
<!-- Legend -->
<div class="flex items-center gap-6 mt-2">
<div class="flex items-center gap-2">
<span class="w-3 h-3 rounded-sm bg-status-positive opacity-80"></span>
<span class="font-metadata text-metadata text-text-secondary">Collected (70%)</span>
</div>
<div class="flex items-center gap-2">
<span class="w-3 h-3 rounded-sm bg-status-warning opacity-60"></span>
<span class="font-metadata text-metadata text-text-secondary">Pending (20%)</span>
</div>
<div class="flex items-center gap-2">
<span class="w-3 h-3 rounded-sm bg-status-critical opacity-70"></span>
<span class="font-metadata text-metadata text-text-secondary">Overdue (10%)</span>
</div>
</div>
</div>
</div>
<!-- Table Section: Receivables Action List -->
<div class="bg-surface border border-border-subtle rounded-xl overflow-hidden flex flex-col">
<div class="p-sub-section-gap border-b border-border-subtle flex items-center justify-between bg-surface-container-lowest">
<h3 class="font-section-title text-section-title text-text-primary">Receivables Action List</h3>
<button class="font-metadata text-metadata text-primary hover:text-primary-container transition-colors font-medium">View All</button>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-lowest border-b border-border-subtle">
<th class="font-table-header text-table-header text-text-secondary py-3 px-sub-section-gap uppercase">CLIENT / PROJECT</th>
<th class="font-table-header text-table-header text-text-secondary py-3 px-sub-section-gap uppercase">INVOICE #</th>
<th class="font-table-header text-table-header text-text-secondary py-3 px-sub-section-gap uppercase text-right">AMOUNT</th>
<th class="font-table-header text-table-header text-text-secondary py-3 px-sub-section-gap uppercase">DUE DATE</th>
<th class="font-table-header text-table-header text-text-secondary py-3 px-sub-section-gap uppercase">STATUS</th>
<th class="font-table-header text-table-header text-text-secondary py-3 px-sub-section-gap w-12"></th>
</tr>
</thead>
<tbody class="font-body text-body text-text-primary">
<!-- Row 1: Overdue -->
<tr class="border-b border-border-subtle hover:bg-surface-container-low transition-colors group">
<td class="py-4 px-sub-section-gap">
<div class="font-medium">Apex Holdings</div>
<div class="font-metadata text-metadata text-text-secondary mt-0.5">Global HQ Campus</div>
</td>
<td class="py-4 px-sub-section-gap text-text-secondary">INV-2023-041</td>
<td class="py-4 px-sub-section-gap text-right font-medium">$125,000.00</td>
<td class="py-4 px-sub-section-gap text-text-secondary">Oct 12, 2023</td>
<td class="py-4 px-sub-section-gap">
<span class="inline-flex items-center px-2 py-1 rounded-md bg-tint-critical text-status-critical font-metadata text-metadata">
                                        Overdue
                                    </span>
</td>
<td class="py-4 px-sub-section-gap text-right">
<button class="text-text-tertiary hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100">
<span class="material-symbols-outlined" style="font-size: 20px;">more_horiz</span>
</button>
</td>
</tr>
<!-- Row 2: Pending -->
<tr class="border-b border-border-subtle hover:bg-surface-container-low transition-colors group">
<td class="py-4 px-sub-section-gap">
<div class="font-medium">Nebula Bio</div>
<div class="font-metadata text-metadata text-text-secondary mt-0.5">Lab Fit-out Phase 2</div>
</td>
<td class="py-4 px-sub-section-gap text-text-secondary">INV-2023-088</td>
<td class="py-4 px-sub-section-gap text-right font-medium">$85,500.00</td>
<td class="py-4 px-sub-section-gap text-text-secondary">Nov 05, 2023</td>
<td class="py-4 px-sub-section-gap">
<span class="inline-flex items-center px-2 py-1 rounded-md bg-tint-warning text-status-warning font-metadata text-metadata">
                                        Pending
                                    </span>
</td>
<td class="py-4 px-sub-section-gap text-right">
<button class="text-text-tertiary hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100">
<span class="material-symbols-outlined" style="font-size: 20px;">more_horiz</span>
</button>
</td>
</tr>
<!-- Row 3: Paid -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="py-4 px-sub-section-gap">
<div class="font-medium">Vanguard Logistics</div>
<div class="font-metadata text-metadata text-text-secondary mt-0.5">Distribution Center Masterplan</div>
</td>
<td class="py-4 px-sub-section-gap text-text-secondary">INV-2023-042</td>
<td class="py-4 px-sub-section-gap text-right font-medium text-text-secondary">$42,000.00</td>
<td class="py-4 px-sub-section-gap text-text-secondary">Oct 28, 2023</td>
<td class="py-4 px-sub-section-gap">
<span class="inline-flex items-center px-2 py-1 rounded-md bg-tint-positive text-status-positive font-metadata text-metadata">
                                        Paid
                                    </span>
</td>
<td class="py-4 px-sub-section-gap text-right">
<button class="text-text-tertiary hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100">
<span class="material-symbols-outlined" style="font-size: 20px;">more_horiz</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</main>
</div>
</body></html>

<!-- Documents -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>AIM StudioOS - Documents</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-surface": "#171c20",
                    "on-tertiary-fixed-variant": "#633f0f",
                    "on-primary": "#ffffff",
                    "surface-variant": "#dfe3e8",
                    "surface-alt": "#F1EFEA",
                    "primary-container": "#2f5e7a",
                    "secondary-container": "#e1dfdb",
                    "text-secondary": "#68707A",
                    "text-primary": "#1F2428",
                    "surface-container-low": "#f0f4f9",
                    "tint-critical": "#F8EEEC",
                    "status-positive": "#3D7A57",
                    "outline-variant": "#c1c7cd",
                    "on-secondary": "#ffffff",
                    "secondary": "#5f5e5b",
                    "on-tertiary-container": "#fec68b",
                    "primary-fixed": "#c7e7ff",
                    "tint-positive": "#EEF5F0",
                    "status-critical": "#A65A4D",
                    "surface-container": "#eaeef4",
                    "inverse-surface": "#2c3135",
                    "secondary-fixed-dim": "#c8c6c2",
                    "surface": "#FFFFFF",
                    "inverse-on-surface": "#edf1f6",
                    "on-error": "#ffffff",
                    "on-error-container": "#93000a",
                    "on-primary-container": "#a8d6f7",
                    "secondary-fixed": "#e4e2dd",
                    "surface-bright": "#f6faff",
                    "inverse-primary": "#9fccec",
                    "status-warning": "#B07A2A",
                    "surface-tint": "#35637f",
                    "primary": "#114661",
                    "tint-info": "#EEF4F8",
                    "border-subtle": "#E4E7EB",
                    "surface-container-highest": "#dfe3e8",
                    "on-primary-fixed-variant": "#184b66",
                    "surface-container-high": "#e4e9ee",
                    "text-tertiary": "#98A0A8",
                    "on-surface-variant": "#41484d",
                    "on-tertiary": "#ffffff",
                    "on-secondary-fixed-variant": "#474744",
                    "surface-container-lowest": "#ffffff",
                    "error-container": "#ffdad6",
                    "surface-dim": "#d6dae0",
                    "on-secondary-container": "#63635f",
                    "on-tertiary-fixed": "#2b1700",
                    "background": "#F7F6F3",
                    "tertiary": "#5e3a0a",
                    "primary-fixed-dim": "#9fccec",
                    "on-background": "#171c20",
                    "on-secondary-fixed": "#1b1c19",
                    "outline": "#71787e",
                    "tertiary-fixed": "#ffddbb",
                    "error": "#ba1a1a",
                    "tertiary-container": "#795120",
                    "tint-warning": "#FBF5EA",
                    "on-primary-fixed": "#001e2e",
                    "tertiary-fixed-dim": "#f3bc81"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "item-gap": "12px",
                    "sub-section-gap": "16px",
                    "canvas-max-width": "1440px",
                    "page-padding": "32px",
                    "section-gap": "24px"
            },
            "fontFamily": {
                    "table-header": ["Inter"],
                    "page-title": ["Inter"],
                    "body": ["Inter"],
                    "section-title": ["Inter"],
                    "card-metric": ["Inter"],
                    "metadata": ["Inter"]
            },
            "fontSize": {
                    "table-header": ["12px", { "lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600" }],
                    "page-title": ["30px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                    "body": ["14px", { "lineHeight": "1.6", "fontWeight": "400" }],
                    "section-title": ["18px", { "lineHeight": "1.4", "fontWeight": "600" }],
                    "card-metric": ["32px", { "lineHeight": "1", "fontWeight": "600" }],
                    "metadata": ["12px", { "lineHeight": "1.4", "fontWeight": "500" }]
            }
          }
        }
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="bg-background min-h-screen text-text-primary antialiased flex flex-col">
<aside class="bg-white dark:bg-zinc-950 font-['Inter'] antialiased tracking-tight text-zinc-800 dark:text-zinc-200 h-screen w-64 fixed left-0 top-0 border-r border-r border-[#E4E7EB] dark:border-zinc-800 flex flex-col h-full py-8 px-4 z-50">
<div class="mb-10 px-4">
<h1 class="text-lg font-bold tracking-tighter text-[#2F5E7A] dark:text-zinc-100">AIM StudioOS</h1>
<p class="font-metadata text-metadata text-zinc-500 mt-1">Executive Briefing</p>
</div>
<nav class="flex flex-col gap-2">
<a class="flex items-center gap-3 px-4 py-2.5 rounded-DEFAULT text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined text-xl">dashboard</span>
<span class="font-body text-body">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-4 py-2.5 rounded-DEFAULT text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined text-xl">architecture</span>
<span class="font-body text-body">Projects</span>
</a>
<a class="flex items-center gap-3 px-4 py-2.5 rounded-DEFAULT text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined text-xl">payments</span>
<span class="font-body text-body">Finance</span>
</a>
<a class="flex items-center gap-3 px-4 py-2.5 rounded-DEFAULT text-[#2F5E7A] dark:text-sky-400 font-semibold bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">description</span>
<span class="font-body text-body">Documents</span>
</a>
<a class="flex items-center gap-3 px-4 py-2.5 rounded-DEFAULT text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined text-xl">history_edu</span>
<span class="font-body text-body">Notes &amp; Activity</span>
</a>
<a class="flex items-center gap-3 px-4 py-2.5 rounded-DEFAULT text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined text-xl">settings</span>
<span class="font-body text-body">Settings</span>
</a>
</nav>
</aside>
<div class="ml-64 flex flex-col flex-1">
<header class="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 w-full border-b border-b border-[#E4E7EB] dark:border-zinc-800 flex items-center justify-between px-8 h-16 ml-64" style="margin-left: 0; width: 100%;">
<div class="flex items-center w-64 bg-surface-container-low rounded-DEFAULT px-3 py-1.5 border border-border-subtle focus-within:border-outline transition-colors">
<span class="material-symbols-outlined text-text-tertiary text-lg mr-2">search</span>
<input class="bg-transparent border-none focus:ring-0 font-body text-body text-text-primary placeholder:text-text-tertiary w-full p-0" placeholder="Search documents..." type="text"/>
</div>
<div class="flex items-center gap-4">
<button class="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all ease-in-out duration-150 p-1.5 rounded-DEFAULT hover:bg-surface-container">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all ease-in-out duration-150 p-1.5 rounded-DEFAULT hover:bg-surface-container">
<span class="material-symbols-outlined">account_circle</span>
</button>
</div>
</header>
<main class="flex-1 w-full max-w-canvas-max-width mx-auto p-page-padding flex flex-col gap-section-gap">
<div class="flex items-end justify-between">
<div>
<h2 class="font-page-title text-page-title text-text-primary">Document Status Overview</h2>
<p class="font-body text-body text-text-secondary mt-2 max-w-2xl">Executive summary of all architectural and financial records. Attention required on missing compliance documents.</p>
</div>
<button class="bg-primary text-on-primary font-metadata text-metadata px-4 py-2 rounded-DEFAULT flex items-center gap-2 hover:bg-primary-container transition-colors">
<span class="material-symbols-outlined text-sm">upload</span>
                    Upload Document
                </button>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-item-gap">
<div class="bg-surface border border-border-subtle rounded-lg p-sub-section-gap shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between h-32 relative overflow-hidden">
<div class="absolute top-0 left-0 w-1 h-full bg-status-positive"></div>
<div class="flex justify-between items-start">
<span class="font-metadata text-metadata text-text-secondary uppercase tracking-wider">Complete &amp; Verified</span>
<span class="material-symbols-outlined text-status-positive">check_circle</span>
</div>
<div class="flex items-baseline gap-3">
<span class="font-card-metric text-card-metric text-text-primary">1,248</span>
<span class="font-metadata text-metadata text-status-positive flex items-center">
<span class="material-symbols-outlined text-[14px]">arrow_upward</span> 12%
                        </span>
</div>
</div>
<div class="bg-surface border border-border-subtle rounded-lg p-sub-section-gap shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between h-32 relative overflow-hidden">
<div class="absolute top-0 left-0 w-1 h-full bg-status-warning"></div>
<div class="flex justify-between items-start">
<span class="font-metadata text-metadata text-text-secondary uppercase tracking-wider">Partial / In Review</span>
<span class="material-symbols-outlined text-status-warning">pending_actions</span>
</div>
<div class="flex items-baseline gap-3">
<span class="font-card-metric text-card-metric text-text-primary">42</span>
<span class="font-metadata text-metadata text-text-secondary">documents</span>
</div>
</div>
<div class="bg-surface border border-border-subtle rounded-lg p-sub-section-gap shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between h-32 relative overflow-hidden">
<div class="absolute top-0 left-0 w-1 h-full bg-status-critical"></div>
<div class="flex justify-between items-start">
<span class="font-metadata text-metadata text-text-secondary uppercase tracking-wider">Missing / At Risk</span>
<span class="material-symbols-outlined text-status-critical">error</span>
</div>
<div class="flex items-baseline gap-3">
<span class="font-card-metric text-card-metric text-text-primary">7</span>
<span class="font-metadata text-metadata text-status-critical flex items-center">
<span class="material-symbols-outlined text-[14px]">arrow_upward</span> 2 new
                        </span>
</div>
</div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-3 gap-section-gap">
<div class="lg:col-span-2 flex flex-col gap-item-gap">
<h3 class="font-section-title text-section-title text-text-primary">Document Register</h3>
<div class="bg-surface border border-border-subtle rounded-lg overflow-hidden flex flex-col">
<div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border-subtle bg-surface-container-lowest">
<div class="col-span-2 font-table-header text-table-header text-text-secondary uppercase">ID</div>
<div class="col-span-4 font-table-header text-table-header text-text-secondary uppercase">Title &amp; Subject</div>
<div class="col-span-3 font-table-header text-table-header text-text-secondary uppercase">Project Reference</div>
<div class="col-span-3 font-table-header text-table-header text-text-secondary uppercase text-right">Status</div>
</div>
<div class="flex flex-col">
<div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border-subtle hover:bg-surface-container-low transition-colors items-center group">
<div class="col-span-2 font-metadata text-metadata text-text-tertiary">DOC-8832</div>
<div class="col-span-4">
<p class="font-body text-body text-text-primary font-medium">Q3 Financial Audit</p>
<p class="font-metadata text-metadata text-text-secondary">Prepared by external council</p>
</div>
<div class="col-span-3 font-body text-body text-text-primary">PRJ-Alpha</div>
<div class="col-span-3 flex justify-end">
<span class="bg-tint-positive text-status-positive px-2.5 py-1 rounded-DEFAULT font-metadata text-metadata uppercase tracking-wider font-semibold border border-[#D5E5DA]">Complete</span>
</div>
</div>
<div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border-subtle hover:bg-surface-container-low transition-colors items-center group">
<div class="col-span-2 font-metadata text-metadata text-text-tertiary">DOC-8835</div>
<div class="col-span-4">
<p class="font-body text-body text-text-primary font-medium">Site Survey &amp; Compliance</p>
<p class="font-metadata text-metadata text-text-secondary">Zoning board approval pending</p>
</div>
<div class="col-span-3 font-body text-body text-text-primary">PRJ-Beacon</div>
<div class="col-span-3 flex justify-end">
<span class="bg-tint-warning text-status-warning px-2.5 py-1 rounded-DEFAULT font-metadata text-metadata uppercase tracking-wider font-semibold border border-[#EBE1CD]">In Review</span>
</div>
</div>
<div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border-subtle bg-[#FEF9F8] hover:bg-[#FDF4F2] transition-colors items-center group">
<div class="col-span-2 font-metadata text-metadata text-text-tertiary">DOC-8840</div>
<div class="col-span-4">
<p class="font-body text-body text-text-primary font-medium">Contractor Liability Insurance</p>
<p class="font-metadata text-metadata text-text-secondary">Expired on 10/24/2023</p>
</div>
<div class="col-span-3 font-body text-body text-text-primary">PRJ-Delta</div>
<div class="col-span-3 flex justify-end">
<span class="bg-tint-critical text-status-critical px-2.5 py-1 rounded-DEFAULT font-metadata text-metadata uppercase tracking-wider font-semibold border border-[#F0D5D1]">Missing</span>
</div>
</div>
<div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border-subtle hover:bg-surface-container-low transition-colors items-center group">
<div class="col-span-2 font-metadata text-metadata text-text-tertiary">DOC-8841</div>
<div class="col-span-4">
<p class="font-body text-body text-text-primary font-medium">Architectural Blueprints v3</p>
<p class="font-metadata text-metadata text-text-secondary">Final structural revisions</p>
</div>
<div class="col-span-3 font-body text-body text-text-primary">PRJ-Beacon</div>
<div class="col-span-3 flex justify-end">
<span class="bg-tint-positive text-status-positive px-2.5 py-1 rounded-DEFAULT font-metadata text-metadata uppercase tracking-wider font-semibold border border-[#D5E5DA]">Complete</span>
</div>
</div>
<div class="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-surface-container-low transition-colors items-center group">
<div class="col-span-2 font-metadata text-metadata text-text-tertiary">DOC-8845</div>
<div class="col-span-4">
<p class="font-body text-body text-text-primary font-medium">Environmental Impact Report</p>
<p class="font-metadata text-metadata text-text-secondary">Drafting phase</p>
</div>
<div class="col-span-3 font-body text-body text-text-primary">PRJ-Echo</div>
<div class="col-span-3 flex justify-end">
<span class="bg-tint-warning text-status-warning px-2.5 py-1 rounded-DEFAULT font-metadata text-metadata uppercase tracking-wider font-semibold border border-[#EBE1CD]">Partial</span>
</div>
</div>
</div>
<div class="px-6 py-3 bg-surface-container-lowest border-t border-border-subtle flex justify-center">
<button class="font-metadata text-metadata text-text-secondary hover:text-text-primary transition-colors">View All Documents</button>
</div>
</div>
</div>
<div class="lg:col-span-1 flex flex-col gap-item-gap">
<h3 class="font-section-title text-section-title text-text-primary">Needs Attention</h3>
<div class="bg-surface border border-border-subtle rounded-lg flex flex-col p-4 gap-4">
<div class="flex gap-3 items-start border-b border-border-subtle pb-4 last:border-0 last:pb-0">
<div class="mt-1 bg-tint-critical rounded-DEFAULT p-1.5 flex items-center justify-center">
<span class="material-symbols-outlined text-status-critical text-sm">warning</span>
</div>
<div class="flex-1">
<h4 class="font-body text-body font-medium text-text-primary">PRJ-Delta: Insurance Renewal</h4>
<p class="font-metadata text-metadata text-text-secondary mt-0.5">Contractor liability documentation is 5 days past due. Structural work blocked.</p>
<button class="font-metadata text-metadata text-primary font-semibold mt-2 hover:underline">Request Update</button>
</div>
</div>
<div class="flex gap-3 items-start border-b border-border-subtle pb-4 last:border-0 last:pb-0">
<div class="mt-1 bg-tint-warning rounded-DEFAULT p-1.5 flex items-center justify-center">
<span class="material-symbols-outlined text-status-warning text-sm">schedule</span>
</div>
<div class="flex-1">
<h4 class="font-body text-body font-medium text-text-primary">PRJ-Beacon: Zoning Approval</h4>
<p class="font-metadata text-metadata text-text-secondary mt-0.5">Document DOC-8835 requires principal signature before municipal submission.</p>
<button class="font-metadata text-metadata text-primary font-semibold mt-2 hover:underline">Review &amp; Sign</button>
</div>
</div>
<div class="flex gap-3 items-start border-b border-border-subtle pb-4 last:border-0 last:pb-0">
<div class="mt-1 bg-tint-critical rounded-DEFAULT p-1.5 flex items-center justify-center">
<span class="material-symbols-outlined text-status-critical text-sm">warning</span>
</div>
<div class="flex-1">
<h4 class="font-body text-body font-medium text-text-primary">PRJ-Alpha: Escrow Release</h4>
<p class="font-metadata text-metadata text-text-secondary mt-0.5">Missing lien waivers from sub-contractors. Payment schedule delayed.</p>
<button class="font-metadata text-metadata text-primary font-semibold mt-2 hover:underline">View Missing Items</button>
</div>
</div>
</div>
</div>
</div>
</main>
</div>
</body></html>

<!-- Projects List -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>AIM StudioOS - Projects List</title>
<!-- Google Fonts: Inter -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Theme Configuration -->
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-surface": "#171c20",
                        "on-tertiary-fixed-variant": "#633f0f",
                        "on-primary": "#ffffff",
                        "surface-variant": "#dfe3e8",
                        "surface-alt": "#F1EFEA",
                        "primary-container": "#2f5e7a",
                        "secondary-container": "#e1dfdb",
                        "text-secondary": "#68707A",
                        "text-primary": "#1F2428",
                        "surface-container-low": "#f0f4f9",
                        "tint-critical": "#F8EEEC",
                        "status-positive": "#3D7A57",
                        "outline-variant": "#c1c7cd",
                        "on-secondary": "#ffffff",
                        "secondary": "#5f5e5b",
                        "on-tertiary-container": "#fec68b",
                        "primary-fixed": "#c7e7ff",
                        "tint-positive": "#EEF5F0",
                        "status-critical": "#A65A4D",
                        "surface-container": "#eaeef4",
                        "inverse-surface": "#2c3135",
                        "secondary-fixed-dim": "#c8c6c2",
                        "surface": "#FFFFFF",
                        "inverse-on-surface": "#edf1f6",
                        "on-error": "#ffffff",
                        "on-error-container": "#93000a",
                        "on-primary-container": "#a8d6f7",
                        "secondary-fixed": "#e4e2dd",
                        "surface-bright": "#f6faff",
                        "inverse-primary": "#9fccec",
                        "status-warning": "#B07A2A",
                        "surface-tint": "#35637f",
                        "primary": "#114661",
                        "tint-info": "#EEF4F8",
                        "border-subtle": "#E4E7EB",
                        "surface-container-highest": "#dfe3e8",
                        "on-primary-fixed-variant": "#184b66",
                        "surface-container-high": "#e4e9ee",
                        "text-tertiary": "#98A0A8",
                        "on-surface-variant": "#41484d",
                        "on-tertiary": "#ffffff",
                        "on-secondary-fixed-variant": "#474744",
                        "surface-container-lowest": "#ffffff",
                        "error-container": "#ffdad6",
                        "surface-dim": "#d6dae0",
                        "on-secondary-container": "#63635f",
                        "on-tertiary-fixed": "#2b1700",
                        "background": "#F7F6F3",
                        "tertiary": "#5e3a0a",
                        "primary-fixed-dim": "#9fccec",
                        "on-background": "#171c20",
                        "on-secondary-fixed": "#1b1c19",
                        "outline": "#71787e",
                        "tertiary-fixed": "#ffddbb",
                        "error": "#ba1a1a",
                        "tertiary-container": "#795120",
                        "tint-warning": "#FBF5EA",
                        "on-primary-fixed": "#001e2e",
                        "tertiary-fixed-dim": "#f3bc81"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "item-gap": "12px",
                        "sub-section-gap": "16px",
                        "canvas-max-width": "1440px",
                        "page-padding": "32px",
                        "section-gap": "24px"
                    },
                    "fontFamily": {
                        "table-header": ["Inter"],
                        "page-title": ["Inter"],
                        "body": ["Inter"],
                        "section-title": ["Inter"],
                        "card-metric": ["Inter"],
                        "metadata": ["Inter"]
                    },
                    "fontSize": {
                        "table-header": ["12px", { "lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600" }],
                        "page-title": ["30px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                        "body": ["14px", { "lineHeight": "1.6", "fontWeight": "400" }],
                        "section-title": ["18px", { "lineHeight": "1.4", "fontWeight": "600" }],
                        "card-metric": ["32px", { "lineHeight": "1", "fontWeight": "600" }],
                        "metadata": ["12px", { "lineHeight": "1.4", "fontWeight": "500" }]
                    }
                }
            }
        }
    </script>
<style>
        /* Base styles to ensure background and scroll behavior */
        body {
            background-color: theme('colors.background');
            color: theme('colors.text-primary');
            overflow-x: hidden;
        }
    </style>
</head>
<body class="antialiased min-h-screen font-body text-body">
<!-- SideNavBar (Shared Component) -->
<nav class="bg-white dark:bg-zinc-950 h-screen w-64 fixed left-0 top-0 border-r border-[#E4E7EB] dark:border-zinc-800 flex flex-col py-8 px-4 z-50">
<!-- Brand Identity -->
<div class="mb-12 px-4 flex flex-col gap-1">
<div class="text-lg font-bold tracking-tighter text-[#2F5E7A] dark:text-zinc-100 font-['Inter']">
                AIM StudioOS
            </div>
<div class="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Executive Briefing
            </div>
</div>
<!-- Navigation Links -->
<div class="flex flex-col gap-1 font-['Inter'] antialiased tracking-tight text-zinc-800 dark:text-zinc-200">
<!-- Inactive -->
<a class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 0;">dashboard</span>
                Dashboard
            </a>
<!-- Active (Projects) -->
<a class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#2F5E7A] dark:text-sky-400 font-semibold bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">architecture</span>
                Projects
            </a>
<!-- Inactive -->
<a class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 0;">payments</span>
                Finance
            </a>
<!-- Inactive -->
<a class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 0;">description</span>
                Documents
            </a>
<!-- Inactive -->
<a class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 0;">history_edu</span>
                Notes &amp; Activity
            </a>
<div class="mt-auto">
<!-- Inactive -->
<a class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 0;">settings</span>
                    Settings
                </a>
</div>
</div>
</nav>
<!-- Main Content Wrapper (Offsets side nav) -->
<div class="ml-64 flex flex-col min-h-screen">
<!-- TopNavBar (Shared Component) -->
<header class="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 w-full border-b border-[#E4E7EB] dark:border-zinc-800 flex items-center justify-between px-8 h-16">
<!-- Left: Context / Search -->
<div class="flex items-center gap-4">
<div class="font-['Inter'] text-sm font-medium text-[#2F5E7A] dark:text-sky-400 flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">search</span>
<span class="text-zinc-500">Search projects, clients, or documents...</span>
</div>
</div>
<!-- Right: Actions -->
<div class="flex items-center gap-5">
<button class="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all ease-in-out duration-150 flex items-center justify-center">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all ease-in-out duration-150 flex items-center justify-center">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">account_circle</span>
</button>
</div>
</header>
<!-- Canvas Area -->
<main class="flex-1 w-full max-w-canvas-max-width mx-auto px-page-padding py-section-gap">
<!-- Page Header -->
<div class="flex items-end justify-between mb-section-gap">
<div>
<h1 class="font-page-title text-page-title text-text-primary mb-2">Projects</h1>
<p class="font-body text-body text-text-secondary">Overview of all active studio engagements and financial status.</p>
</div>
<div class="flex items-center gap-item-gap">
<button class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-subtle bg-surface text-text-primary font-metadata text-metadata hover:bg-surface-alt transition-colors duration-200">
<span class="material-symbols-outlined text-[16px]">filter_list</span>
                        Filter View
                    </button>
<button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-metadata text-metadata hover:opacity-90 transition-opacity duration-200 shadow-sm">
<span class="material-symbols-outlined text-[16px]">add</span>
                        New Project
                    </button>
</div>
</div>
<!-- Summary Strip (Bento-style metrics) -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-item-gap mb-section-gap">
<!-- Highlight Card -->
<div class="col-span-2 bg-surface border border-border-subtle rounded-xl p-6 flex flex-col justify-between shadow-sm shadow-black/[0.02]">
<div class="flex items-center justify-between mb-4">
<h2 class="font-metadata text-metadata text-text-secondary uppercase tracking-wider">Total Active Portfolio Value</h2>
<span class="material-symbols-outlined text-text-tertiary">monitoring</span>
</div>
<div>
<div class="font-card-metric text-card-metric text-text-primary tabular-nums tracking-tight">$12,450,000</div>
<div class="font-metadata text-metadata text-status-positive mt-1 flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">arrow_upward</span>
                            8.2% vs last quarter
                        </div>
</div>
</div>
<!-- Secondary Cards -->
<div class="bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between">
<h2 class="font-metadata text-metadata text-text-secondary uppercase tracking-wider mb-2">Active Projects</h2>
<div class="flex items-end justify-between">
<div class="font-card-metric text-card-metric text-text-primary tabular-nums">24</div>
<div class="font-metadata text-metadata text-text-secondary mb-1">Engagements</div>
</div>
</div>
<div class="bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between bg-gradient-to-br from-surface to-tint-warning/30">
<h2 class="font-metadata text-metadata text-text-secondary uppercase tracking-wider mb-2">At-Risk Projects</h2>
<div class="flex items-end justify-between">
<div class="font-card-metric text-card-metric text-status-warning tabular-nums">3</div>
<div class="font-metadata text-metadata text-status-warning mb-1 flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">warning</span>
                            Needs Review
                        </div>
</div>
</div>
</div>
<!-- Data Table Container -->
<div class="bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-sm shadow-black/[0.02]">
<!-- Table Controls / Header -->
<div class="px-5 py-4 border-b border-border-subtle flex items-center justify-between bg-surface-alt/50">
<h3 class="font-section-title text-section-title text-text-primary">Current Engagements</h3>
<div class="flex items-center gap-3">
<span class="font-metadata text-metadata text-text-secondary">Showing 5 of 24</span>
</div>
</div>
<!-- Table -->
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface border-b border-border-subtle">
<th class="py-3 px-5 font-table-header text-table-header text-text-secondary uppercase whitespace-nowrap">Project Name</th>
<th class="py-3 px-5 font-table-header text-table-header text-text-secondary uppercase whitespace-nowrap">Client</th>
<th class="py-3 px-5 font-table-header text-table-header text-text-secondary uppercase whitespace-nowrap">Status</th>
<th class="py-3 px-5 font-table-header text-table-header text-text-secondary uppercase whitespace-nowrap">Manager</th>
<th class="py-3 px-5 font-table-header text-table-header text-text-secondary uppercase text-right whitespace-nowrap">Contract Value</th>
<th class="py-3 px-5 font-table-header text-table-header text-text-secondary uppercase text-right whitespace-nowrap">Invoiced</th>
<th class="py-3 px-5 font-table-header text-table-header text-text-secondary uppercase text-right whitespace-nowrap">Paid</th>
<th class="py-3 px-5 font-table-header text-table-header text-text-secondary uppercase text-right whitespace-nowrap">Receivables</th>
</tr>
</thead>
<tbody class="divide-y divide-border-subtle">
<!-- Row 1: On Track -->
<tr class="group hover:bg-surface-container-low transition-colors duration-150 cursor-pointer">
<td class="py-4 px-5">
<div class="font-body text-body text-text-primary font-medium">Apex Tower Renovation</div>
<div class="font-metadata text-metadata text-text-tertiary mt-0.5">PRJ-2023-041</div>
</td>
<td class="py-4 px-5 font-body text-body text-text-secondary">Zenith Corp</td>
<td class="py-4 px-5">
<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-tint-positive text-status-positive font-metadata text-metadata border border-status-positive/10">
<span class="w-1.5 h-1.5 rounded-full bg-status-positive"></span>
                                        On Track
                                    </span>
</td>
<td class="py-4 px-5">
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-metadata text-[10px] font-bold">JD</div>
<span class="font-body text-body text-text-secondary">J. Doe</span>
</div>
</td>
<td class="py-4 px-5 font-body text-body text-text-primary text-right tabular-nums">$1,200,000</td>
<td class="py-4 px-5 font-body text-body text-text-secondary text-right tabular-nums">$800,000</td>
<td class="py-4 px-5 font-body text-body text-text-secondary text-right tabular-nums">$750,000</td>
<td class="py-4 px-5 font-body text-body text-text-primary font-medium text-right tabular-nums">$50,000</td>
</tr>
<!-- Row 2: At Risk -->
<tr class="group hover:bg-surface-container-low transition-colors duration-150 cursor-pointer bg-tint-warning/10">
<td class="py-4 px-5">
<div class="font-body text-body text-text-primary font-medium">Lumina Campus Phase 2</div>
<div class="font-metadata text-metadata text-text-tertiary mt-0.5">PRJ-2023-088</div>
</td>
<td class="py-4 px-5 font-body text-body text-text-secondary">Lumina Education</td>
<td class="py-4 px-5">
<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-tint-warning text-status-warning font-metadata text-metadata border border-status-warning/10">
<span class="w-1.5 h-1.5 rounded-full bg-status-warning"></span>
                                        At Risk
                                    </span>
</td>
<td class="py-4 px-5">
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-metadata text-[10px] font-bold">AK</div>
<span class="font-body text-body text-text-secondary">A. Khan</span>
</div>
</td>
<td class="py-4 px-5 font-body text-body text-text-primary text-right tabular-nums">$3,500,000</td>
<td class="py-4 px-5 font-body text-body text-text-secondary text-right tabular-nums">$1,500,000</td>
<td class="py-4 px-5 font-body text-body text-text-secondary text-right tabular-nums">$1,000,000</td>
<td class="py-4 px-5 font-body text-body text-status-warning font-medium text-right tabular-nums">$500,000</td>
</tr>
<!-- Row 3: Completed (Quiet) -->
<tr class="group hover:bg-surface-container-low transition-colors duration-150 cursor-pointer opacity-75">
<td class="py-4 px-5">
<div class="font-body text-body text-text-primary font-medium">Riverfront Pavilion</div>
<div class="font-metadata text-metadata text-text-tertiary mt-0.5">PRJ-2022-112</div>
</td>
<td class="py-4 px-5 font-body text-body text-text-secondary">City Parks Dept</td>
<td class="py-4 px-5">
<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-variant text-text-secondary font-metadata text-metadata border border-border-subtle">
<span class="material-symbols-outlined text-[12px]">check</span>
                                        Completed
                                    </span>
</td>
<td class="py-4 px-5">
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-surface-dim text-text-secondary flex items-center justify-center font-metadata text-[10px] font-bold">MR</div>
<span class="font-body text-body text-text-secondary">M. Ross</span>
</div>
</td>
<td class="py-4 px-5 font-body text-body text-text-secondary text-right tabular-nums">$850,000</td>
<td class="py-4 px-5 font-body text-body text-text-secondary text-right tabular-nums">$850,000</td>
<td class="py-4 px-5 font-body text-body text-text-secondary text-right tabular-nums">$850,000</td>
<td class="py-4 px-5 font-body text-body text-text-secondary text-right tabular-nums">$0</td>
</tr>
<!-- Row 4: Delayed -->
<tr class="group hover:bg-surface-container-low transition-colors duration-150 cursor-pointer">
<td class="py-4 px-5">
<div class="font-body text-body text-text-primary font-medium">Helix Data Center</div>
<div class="font-metadata text-metadata text-text-tertiary mt-0.5">PRJ-2023-055</div>
</td>
<td class="py-4 px-5 font-body text-body text-text-secondary">Nexus Tech</td>
<td class="py-4 px-5">
<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-tint-critical text-status-critical font-metadata text-metadata border border-status-critical/10">
<span class="material-symbols-outlined text-[12px]">schedule</span>
                                        Delayed
                                    </span>
</td>
<td class="py-4 px-5">
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-metadata text-[10px] font-bold">JD</div>
<span class="font-body text-body text-text-secondary">J. Doe</span>
</div>
</td>
<td class="py-4 px-5 font-body text-body text-text-primary text-right tabular-nums">$4,200,000</td>
<td class="py-4 px-5 font-body text-body text-text-secondary text-right tabular-nums">$2,100,000</td>
<td class="py-4 px-5 font-body text-body text-text-secondary text-right tabular-nums">$1,900,000</td>
<td class="py-4 px-5 font-body text-body text-text-primary font-medium text-right tabular-nums">$200,000</td>
</tr>
<!-- Row 5: On Track -->
<tr class="group hover:bg-surface-container-low transition-colors duration-150 cursor-pointer">
<td class="py-4 px-5">
<div class="font-body text-body text-text-primary font-medium">Sova HQ Interior</div>
<div class="font-metadata text-metadata text-text-tertiary mt-0.5">PRJ-2024-002</div>
</td>
<td class="py-4 px-5 font-body text-body text-text-secondary">Sova Group</td>
<td class="py-4 px-5">
<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-tint-positive text-status-positive font-metadata text-metadata border border-status-positive/10">
<span class="w-1.5 h-1.5 rounded-full bg-status-positive"></span>
                                        On Track
                                    </span>
</td>
<td class="py-4 px-5">
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-metadata text-[10px] font-bold">SL</div>
<span class="font-body text-body text-text-secondary">S. Lee</span>
</div>
</td>
<td class="py-4 px-5 font-body text-body text-text-primary text-right tabular-nums">$2,800,000</td>
<td class="py-4 px-5 font-body text-body text-text-secondary text-right tabular-nums">$500,000</td>
<td class="py-4 px-5 font-body text-body text-text-secondary text-right tabular-nums">$500,000</td>
<td class="py-4 px-5 font-body text-body text-text-primary font-medium text-right tabular-nums">$0</td>
</tr>
</tbody>
</table>
</div>
</div>
</main>
</div>
</body></html>

<!-- Project Detail -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>AIM StudioOS - Project Detail</title>
<!-- Fonts & Icons -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Tailwind Config Injection -->
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-surface": "#171c20",
                        "on-tertiary-fixed-variant": "#633f0f",
                        "on-primary": "#ffffff",
                        "surface-variant": "#dfe3e8",
                        "surface-alt": "#F1EFEA",
                        "primary-container": "#2f5e7a",
                        "secondary-container": "#e1dfdb",
                        "text-secondary": "#68707A",
                        "text-primary": "#1F2428",
                        "surface-container-low": "#f0f4f9",
                        "tint-critical": "#F8EEEC",
                        "status-positive": "#3D7A57",
                        "outline-variant": "#c1c7cd",
                        "on-secondary": "#ffffff",
                        "secondary": "#5f5e5b",
                        "on-tertiary-container": "#fec68b",
                        "primary-fixed": "#c7e7ff",
                        "tint-positive": "#EEF5F0",
                        "status-critical": "#A65A4D",
                        "surface-container": "#eaeef4",
                        "inverse-surface": "#2c3135",
                        "secondary-fixed-dim": "#c8c6c2",
                        "surface": "#FFFFFF",
                        "inverse-on-surface": "#edf1f6",
                        "on-error": "#ffffff",
                        "on-error-container": "#93000a",
                        "on-primary-container": "#a8d6f7",
                        "secondary-fixed": "#e4e2dd",
                        "surface-bright": "#f6faff",
                        "inverse-primary": "#9fccec",
                        "status-warning": "#B07A2A",
                        "surface-tint": "#35637f",
                        "primary": "#114661",
                        "tint-info": "#EEF4F8",
                        "border-subtle": "#E4E7EB",
                        "surface-container-highest": "#dfe3e8",
                        "on-primary-fixed-variant": "#184b66",
                        "surface-container-high": "#e4e9ee",
                        "text-tertiary": "#98A0A8",
                        "on-surface-variant": "#41484d",
                        "on-tertiary": "#ffffff",
                        "on-secondary-fixed-variant": "#474744",
                        "surface-container-lowest": "#ffffff",
                        "error-container": "#ffdad6",
                        "surface-dim": "#d6dae0",
                        "on-secondary-container": "#63635f",
                        "on-tertiary-fixed": "#2b1700",
                        "background": "#F7F6F3",
                        "tertiary": "#5e3a0a",
                        "primary-fixed-dim": "#9fccec",
                        "on-background": "#171c20",
                        "on-secondary-fixed": "#1b1c19",
                        "outline": "#71787e",
                        "tertiary-fixed": "#ffddbb",
                        "error": "#ba1a1a",
                        "tertiary-container": "#795120",
                        "tint-warning": "#FBF5EA",
                        "on-primary-fixed": "#001e2e",
                        "tertiary-fixed-dim": "#f3bc81"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "item-gap": "12px",
                        "sub-section-gap": "16px",
                        "canvas-max-width": "1440px",
                        "page-padding": "32px",
                        "section-gap": "24px"
                    },
                    "fontFamily": {
                        "table-header": ["Inter"],
                        "page-title": ["Inter"],
                        "body": ["Inter"],
                        "section-title": ["Inter"],
                        "card-metric": ["Inter"],
                        "metadata": ["Inter"]
                    },
                    "fontSize": {
                        "table-header": ["12px", { "lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600" }],
                        "page-title": ["30px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                        "body": ["14px", { "lineHeight": "1.6", "fontWeight": "400" }],
                        "section-title": ["18px", { "lineHeight": "1.4", "fontWeight": "600" }],
                        "card-metric": ["32px", { "lineHeight": "1", "fontWeight": "600" }],
                        "metadata": ["12px", { "lineHeight": "1.4", "fontWeight": "500" }]
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-background text-text-primary font-body antialiased selection:bg-primary-container selection:text-on-primary-container">
<!-- Shared Component: SideNavBar -->
<nav class="bg-white dark:bg-zinc-950 h-screen w-64 fixed left-0 top-0 border-r border-[#E4E7EB] dark:border-zinc-800 flex flex-col py-8 px-4 z-50">
<!-- Brand / Header -->
<div class="mb-10 px-2 flex items-center gap-3">
<div class="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                A
            </div>
<div>
<h1 class="text-lg font-bold tracking-tighter text-[#2F5E7A] dark:text-zinc-100 leading-tight">AIM StudioOS</h1>
<p class="text-zinc-500 dark:text-zinc-400 text-xs font-medium">Executive Briefing</p>
</div>
</div>
<!-- Navigation Tabs -->
<ul class="flex flex-col gap-1 w-full">
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined text-[20px]">dashboard</span>
<span class="text-sm">Dashboard</span>
</a>
</li>
<!-- ACTIVE TAB: Projects -->
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-[#2F5E7A] dark:text-sky-400 font-semibold bg-zinc-50 dark:bg-zinc-900/50 cursor-pointer active:opacity-80 transition-colors duration-200" href="#">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">architecture</span>
<span class="text-sm">Projects</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined text-[20px]">payments</span>
<span class="text-sm">Finance</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined text-[20px]">description</span>
<span class="text-sm">Documents</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined text-[20px]">history_edu</span>
<span class="text-sm">Notes &amp; Activity</span>
</a>
</li>
</ul>
<div class="mt-auto">
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-200 cursor-pointer active:opacity-80" href="#">
<span class="material-symbols-outlined text-[20px]">settings</span>
<span class="text-sm">Settings</span>
</a>
</div>
</nav>
<!-- Main Content Wrapper -->
<div class="ml-64 min-h-screen flex flex-col relative">
<!-- Shared Component: TopNavBar -->
<header class="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 w-full border-b border-[#E4E7EB] dark:border-zinc-800 flex items-center justify-between px-8 h-16">
<!-- Search on Left -->
<div class="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 transition-all ease-in-out duration-150">
<span class="material-symbols-outlined text-[20px]">search</span>
<input class="bg-transparent border-none outline-none text-sm font-['Inter'] w-64 focus:ring-0 placeholder:text-zinc-400" placeholder="Search StudioOS..." type="text"/>
</div>
<!-- Trailing Actions -->
<div class="flex items-center gap-5 text-[#2F5E7A] dark:text-sky-400">
<button class="hover:text-zinc-900 dark:hover:text-white transition-all ease-in-out duration-150 flex items-center justify-center">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="hover:text-zinc-900 dark:hover:text-white transition-all ease-in-out duration-150 flex items-center justify-center">
<span class="material-symbols-outlined">account_circle</span>
</button>
</div>
</header>
<!-- Page Canvas -->
<main class="flex-1 p-page-padding w-full max-w-canvas-max-width mx-auto flex flex-col gap-section-gap">
<!-- Page Header -->
<div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
<div>
<h2 class="font-page-title text-page-title text-text-primary tracking-tight">Nexus Corporate HQ Revamp</h2>
<p class="font-metadata text-metadata text-text-secondary mt-1 flex items-center gap-2">
<span>Project ID: PRJ-2024-089</span>
<span class="text-border-subtle">•</span>
<span>Principal: Sarah Jenkins</span>
<span class="text-border-subtle">•</span>
<span>Phase: Construction Documents</span>
</p>
</div>
<div class="flex items-center gap-3">
<span class="bg-tint-positive text-status-positive px-3 py-1.5 rounded-full font-metadata text-metadata border border-status-positive/20 flex items-center gap-1.5">
<div class="w-1.5 h-1.5 rounded-full bg-status-positive"></div>
                        On Schedule
                    </span>
<button class="bg-surface border border-border-subtle text-text-primary hover:bg-surface-alt px-4 py-1.5 rounded-lg font-metadata text-metadata transition-colors duration-200">
                        View Full Brief
                    </button>
</div>
</div>
<!-- Executive Summary Cards (Bento style) -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-item-gap">
<!-- Financial Health -->
<div class="bg-surface rounded-xl border border-border-subtle p-6 flex flex-col shadow-sm shadow-black/[0.02]">
<div class="flex justify-between items-start mb-6">
<h3 class="font-section-title text-section-title text-text-primary">Financial Health</h3>
<span class="material-symbols-outlined text-text-tertiary">account_balance</span>
</div>
<div class="mt-auto">
<div class="font-card-metric text-card-metric text-text-primary mb-2">$4.2M</div>
<div class="font-metadata text-metadata text-text-secondary flex items-center justify-between">
<span>Billed to Date</span>
<span class="text-status-warning bg-tint-warning px-2 py-0.5 rounded font-medium">85% of Budget</span>
</div>
<div class="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
<div class="bg-status-warning h-full rounded-full" style="width: 85%"></div>
</div>
</div>
</div>
<!-- Project Progress -->
<div class="bg-surface rounded-xl border border-border-subtle p-6 flex flex-col shadow-sm shadow-black/[0.02]">
<div class="flex justify-between items-start mb-6">
<h3 class="font-section-title text-section-title text-text-primary">Overall Progress</h3>
<span class="material-symbols-outlined text-text-tertiary">timeline</span>
</div>
<div class="mt-auto flex items-end gap-4">
<div class="relative w-16 h-16 flex items-center justify-center">
<svg class="w-full h-full transform -rotate-90" viewbox="0 0 36 36">
<path class="text-surface-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
<path class="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="72, 100" stroke-linecap="round" stroke-width="3"></path>
</svg>
<span class="absolute font-metadata text-metadata text-text-primary font-bold">72%</span>
</div>
<div class="flex-1 pb-1">
<div class="font-metadata text-metadata text-text-secondary mb-1">Current Phase</div>
<div class="text-body font-body font-medium text-text-primary truncate">CD Sets &amp; Permitting</div>
</div>
</div>
</div>
<!-- Key Milestone -->
<div class="bg-primary text-on-primary rounded-xl border border-primary-container p-6 flex flex-col shadow-sm shadow-black/[0.04]">
<div class="flex justify-between items-start mb-6">
<h3 class="font-section-title text-section-title opacity-90">Next Milestone</h3>
<span class="material-symbols-outlined opacity-70">flag</span>
</div>
<div class="mt-auto">
<div class="font-metadata text-metadata opacity-80 mb-1">Due in 14 Days (Oct 28)</div>
<div class="text-[20px] font-semibold leading-tight mb-3">Final Permit Submission to City Council</div>
<a class="inline-flex items-center gap-1 font-metadata text-metadata text-primary-fixed hover:text-white transition-colors" href="#">
                            View Dependencies <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
</div>
</div>
<!-- Two Column Layout: Finance Table & Context -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-item-gap">
<!-- Finance Table Summary (Spans 2 cols) -->
<div class="lg:col-span-2 bg-surface border border-border-subtle rounded-xl overflow-hidden flex flex-col shadow-sm shadow-black/[0.02]">
<div class="p-5 border-b border-border-subtle flex justify-between items-center bg-surface-lowest">
<h3 class="font-section-title text-section-title text-text-primary">Phase Financials</h3>
<button class="material-symbols-outlined text-text-secondary hover:text-text-primary transition-colors">more_horiz</button>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr>
<th class="font-table-header text-table-header text-text-secondary py-3 px-5 border-b border-border-subtle bg-surface-alt/50 uppercase tracking-wider">Phase</th>
<th class="font-table-header text-table-header text-text-secondary py-3 px-5 border-b border-border-subtle bg-surface-alt/50 uppercase tracking-wider text-right">Budget</th>
<th class="font-table-header text-table-header text-text-secondary py-3 px-5 border-b border-border-subtle bg-surface-alt/50 uppercase tracking-wider text-right">Actuals</th>
<th class="font-table-header text-table-header text-text-secondary py-3 px-5 border-b border-border-subtle bg-surface-alt/50 uppercase tracking-wider text-right">Variance</th>
</tr>
</thead>
<tbody class="font-body text-body">
<tr class="hover:bg-surface-alt/30 transition-colors">
<td class="py-3 px-5 border-b border-border-subtle text-text-primary font-medium">Concept Design</td>
<td class="py-3 px-5 border-b border-border-subtle text-text-secondary text-right">$450,000</td>
<td class="py-3 px-5 border-b border-border-subtle text-text-primary text-right">$445,200</td>
<td class="py-3 px-5 border-b border-border-subtle text-status-positive text-right text-xs font-medium bg-tint-positive/30">+1.1%</td>
</tr>
<tr class="hover:bg-surface-alt/30 transition-colors">
<td class="py-3 px-5 border-b border-border-subtle text-text-primary font-medium">Schematic Design</td>
<td class="py-3 px-5 border-b border-border-subtle text-text-secondary text-right">$850,000</td>
<td class="py-3 px-5 border-b border-border-subtle text-text-primary text-right">$890,500</td>
<td class="py-3 px-5 border-b border-border-subtle text-status-critical text-right text-xs font-medium bg-tint-critical/30">-4.7%</td>
</tr>
<tr class="hover:bg-surface-alt/30 transition-colors">
<td class="py-3 px-5 border-b border-border-subtle text-text-primary font-medium">Design Development</td>
<td class="py-3 px-5 border-b border-border-subtle text-text-secondary text-right">$1,200,000</td>
<td class="py-3 px-5 border-b border-border-subtle text-text-primary text-right">$1,150,000</td>
<td class="py-3 px-5 border-b border-border-subtle text-status-positive text-right text-xs font-medium bg-tint-positive/30">+4.2%</td>
</tr>
<tr class="bg-surface-alt/10">
<td class="py-3 px-5 text-text-primary font-semibold">Total to Date</td>
<td class="py-3 px-5 text-text-primary font-semibold text-right">$2,500,000</td>
<td class="py-3 px-5 text-text-primary font-semibold text-right">$2,485,700</td>
<td class="py-3 px-5 text-status-positive font-semibold text-right text-xs">+0.5%</td>
</tr>
</tbody>
</table>
</div>
</div>
<!-- Strategic Notes (1 Col) -->
<div class="bg-surface border border-border-subtle rounded-xl flex flex-col shadow-sm shadow-black/[0.02]">
<div class="p-5 border-b border-border-subtle flex justify-between items-center">
<h3 class="font-section-title text-section-title text-text-primary flex items-center gap-2">
<span class="material-symbols-outlined text-[20px] text-primary">lightbulb</span>
                            Strategic Notes
                        </h3>
</div>
<div class="p-5 flex-1 flex flex-col gap-4 overflow-y-auto max-h-[280px]">
<div class="border-l-2 border-primary pl-3 py-1">
<p class="font-metadata text-metadata text-text-secondary mb-1">Oct 12 • Principal Memo</p>
<p class="font-body text-body text-text-primary text-sm leading-relaxed">Client requested a review of sustainable materials for the lobby atrium. Team is gathering comparative cost analysis for next Tuesday's meeting.</p>
</div>
<div class="border-l-2 border-border-subtle pl-3 py-1 opacity-70 hover:opacity-100 transition-opacity">
<p class="font-metadata text-metadata text-text-secondary mb-1">Oct 05 • Engineering Sync</p>
<p class="font-body text-body text-text-primary text-sm leading-relaxed">HVAC routing needs minor adjustment on floor 3 due to structural beam placement. No impact to budget expected.</p>
</div>
</div>
<div class="p-4 border-t border-border-subtle bg-surface-alt/30">
<button class="w-full text-center font-metadata text-metadata text-primary font-medium hover:text-primary-container transition-colors">
                            + Add New Note
                        </button>
</div>
</div>
</div>
<!-- Documents Checklist -->
<div class="bg-surface border border-border-subtle rounded-xl shadow-sm shadow-black/[0.02]">
<div class="p-5 border-b border-border-subtle flex justify-between items-center">
<h3 class="font-section-title text-section-title text-text-primary">Phase Deliverables Completeness</h3>
<div class="font-metadata text-metadata text-text-secondary">4 of 6 Required Documents Approved</div>
</div>
<div class="p-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
<div class="flex items-center justify-between p-3 rounded hover:bg-surface-alt/50 transition-colors group">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-status-positive">check_circle</span>
<span class="font-body text-body text-text-primary font-medium">Site Plan Draft V2</span>
</div>
<span class="font-metadata text-metadata text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">Updated 2d ago</span>
</div>
<div class="flex items-center justify-between p-3 rounded hover:bg-surface-alt/50 transition-colors group">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-status-positive">check_circle</span>
<span class="font-body text-body text-text-primary font-medium">Environmental Impact Study</span>
</div>
<span class="font-metadata text-metadata text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">Updated 1w ago</span>
</div>
<div class="flex items-center justify-between p-3 rounded bg-tint-critical/10 border border-tint-critical hover:bg-tint-critical/20 transition-colors">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-status-critical">error</span>
<span class="font-body text-body text-status-critical font-medium">Structural Engineering Review</span>
</div>
<span class="bg-tint-critical text-status-critical px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">Missing</span>
</div>
<div class="flex items-center justify-between p-3 rounded hover:bg-surface-alt/50 transition-colors group">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-status-positive">check_circle</span>
<span class="font-body text-body text-text-primary font-medium">Budget Baseline Approval</span>
</div>
<span class="font-metadata text-metadata text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">Updated 3w ago</span>
</div>
<div class="flex items-center justify-between p-3 rounded bg-tint-warning/30 border border-tint-warning/50 hover:bg-tint-warning/50 transition-colors">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-status-warning">pending</span>
<span class="font-body text-body text-text-primary font-medium">Lighting &amp; Electrical Plan</span>
</div>
<span class="text-status-warning px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">In Review</span>
</div>
</div>
</div>
</main>
</div>
</body></html>

<!-- Principal Dashboard -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Principal Dashboard - AIM StudioOS</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-surface": "#171c20",
                        "on-tertiary-fixed-variant": "#633f0f",
                        "on-primary": "#ffffff",
                        "surface-variant": "#dfe3e8",
                        "surface-alt": "#F1EFEA",
                        "primary-container": "#2f5e7a",
                        "secondary-container": "#e1dfdb",
                        "text-secondary": "#68707A",
                        "text-primary": "#1F2428",
                        "surface-container-low": "#f0f4f9",
                        "tint-critical": "#F8EEEC",
                        "status-positive": "#3D7A57",
                        "outline-variant": "#c1c7cd",
                        "on-secondary": "#ffffff",
                        "secondary": "#5f5e5b",
                        "on-tertiary-container": "#fec68b",
                        "primary-fixed": "#c7e7ff",
                        "tint-positive": "#EEF5F0",
                        "status-critical": "#A65A4D",
                        "surface-container": "#eaeef4",
                        "inverse-surface": "#2c3135",
                        "secondary-fixed-dim": "#c8c6c2",
                        "surface": "#FFFFFF",
                        "inverse-on-surface": "#edf1f6",
                        "on-error": "#ffffff",
                        "on-error-container": "#93000a",
                        "on-primary-container": "#a8d6f7",
                        "secondary-fixed": "#e4e2dd",
                        "surface-bright": "#f6faff",
                        "inverse-primary": "#9fccec",
                        "status-warning": "#B07A2A",
                        "surface-tint": "#35637f",
                        "primary": "#114661",
                        "tint-info": "#EEF4F8",
                        "border-subtle": "#E4E7EB",
                        "surface-container-highest": "#dfe3e8",
                        "on-primary-fixed-variant": "#184b66",
                        "surface-container-high": "#e4e9ee",
                        "text-tertiary": "#98A0A8",
                        "on-surface-variant": "#41484d",
                        "on-tertiary": "#ffffff",
                        "on-secondary-fixed-variant": "#474744",
                        "surface-container-lowest": "#ffffff",
                        "error-container": "#ffdad6",
                        "surface-dim": "#d6dae0",
                        "on-secondary-container": "#63635f",
                        "on-tertiary-fixed": "#2b1700",
                        "background": "#F7F6F3",
                        "tertiary": "#5e3a0a",
                        "primary-fixed-dim": "#9fccec",
                        "on-background": "#171c20",
                        "on-secondary-fixed": "#1b1c19",
                        "outline": "#71787e",
                        "tertiary-fixed": "#ffddbb",
                        "error": "#ba1a1a",
                        "tertiary-container": "#795120",
                        "tint-warning": "#FBF5EA",
                        "on-primary-fixed": "#001e2e",
                        "tertiary-fixed-dim": "#f3bc81"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "item-gap": "12px",
                        "sub-section-gap": "16px",
                        "canvas-max-width": "1440px",
                        "page-padding": "32px",
                        "section-gap": "24px"
                    },
                    "fontFamily": {
                        "table-header": ["Inter"],
                        "page-title": ["Inter"],
                        "body": ["Inter"],
                        "section-title": ["Inter"],
                        "card-metric": ["Inter"],
                        "metadata": ["Inter"]
                    },
                    "fontSize": {
                        "table-header": ["12px", { "lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600" }],
                        "page-title": ["30px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                        "body": ["14px", { "lineHeight": "1.6", "fontWeight": "400" }],
                        "section-title": ["18px", { "lineHeight": "1.4", "fontWeight": "600" }],
                        "card-metric": ["32px", { "lineHeight": "1", "fontWeight": "600" }],
                        "metadata": ["12px", { "lineHeight": "1.4", "fontWeight": "500" }]
                    }
                }
            }
        }
    </script>
<style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-background text-text-primary min-h-screen flex">
<!-- SideNavBar (from JSON) -->
<nav class="h-screen w-64 fixed left-0 top-0 border-r border-r border-[#E4E7EB] bg-white hidden md:flex flex-col py-8 px-4 font-['Inter'] antialiased tracking-tight text-zinc-800 z-50">
<div class="mb-10 px-4">
<h1 class="text-lg font-bold tracking-tighter text-[#2F5E7A]">AIM StudioOS</h1>
<p class="font-metadata text-metadata text-text-secondary mt-1">Executive Briefing</p>
</div>
<div class="flex-1 flex flex-col gap-2">
<!-- Active Tab -->
<a class="flex items-center gap-3 px-4 py-2 rounded-DEFAULT text-[#2F5E7A] font-semibold bg-zinc-50 cursor-pointer transition-colors duration-200" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">dashboard</span>
<span class="font-body text-body">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 rounded-DEFAULT text-zinc-500 font-medium hover:bg-zinc-50 transition-colors duration-200 cursor-pointer" href="#">
<span class="material-symbols-outlined">architecture</span>
<span class="font-body text-body">Projects</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 rounded-DEFAULT text-zinc-500 font-medium hover:bg-zinc-50 transition-colors duration-200 cursor-pointer" href="#">
<span class="material-symbols-outlined">payments</span>
<span class="font-body text-body">Finance</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 rounded-DEFAULT text-zinc-500 font-medium hover:bg-zinc-50 transition-colors duration-200 cursor-pointer" href="#">
<span class="material-symbols-outlined">description</span>
<span class="font-body text-body">Documents</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 rounded-DEFAULT text-zinc-500 font-medium hover:bg-zinc-50 transition-colors duration-200 cursor-pointer" href="#">
<span class="material-symbols-outlined">history_edu</span>
<span class="font-body text-body">Notes &amp; Activity</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 rounded-DEFAULT text-zinc-500 font-medium hover:bg-zinc-50 transition-colors duration-200 cursor-pointer mt-auto" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="font-body text-body">Settings</span>
</a>
</div>
</nav>
<!-- Main Content Area -->
<div class="flex-1 md:ml-64 flex flex-col min-h-screen">
<!-- TopNavBar (from JSON) -->
<header class="sticky top-0 z-40 w-full border-b border-b border-[#E4E7EB] bg-white/80 backdrop-blur-md flex items-center justify-between px-8 h-16">
<div class="flex items-center gap-4">
<!-- Search Bar -->
<div class="relative hidden sm:block">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">search</span>
<input class="pl-9 pr-4 py-1.5 bg-surface-container-low border-transparent focus:border-border-subtle focus:ring-0 rounded-DEFAULT font-body text-body text-text-primary w-64 transition-all" placeholder="Search..." type="text"/>
</div>
</div>
<div class="flex items-center gap-4">
<button class="p-2 text-zinc-500 hover:text-zinc-900 transition-all ease-in-out duration-150 rounded-full hover:bg-surface-container-low">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="p-2 text-zinc-500 hover:text-zinc-900 transition-all ease-in-out duration-150 rounded-full hover:bg-surface-container-low">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">account_circle</span>
</button>
</div>
</header>
<!-- Canvas -->
<main class="flex-1 p-page-padding max-w-canvas-max-width mx-auto w-full flex flex-col gap-section-gap">
<!-- Page Header -->
<div class="flex flex-col gap-1 mb-2">
<h2 class="font-page-title text-page-title text-text-primary">Executive Briefing</h2>
<p class="font-body text-body text-text-secondary">Q3 Overview &amp; Operational Status</p>
</div>
<!-- Bento Grid: Key Metrics -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-item-gap">
<!-- Metric Card 1 -->
<div class="bg-surface border border-border-subtle rounded-lg p-sub-section-gap flex flex-col gap-2 shadow-sm">
<p class="font-metadata text-metadata text-text-secondary uppercase">Contract Value</p>
<p class="font-card-metric text-card-metric text-text-primary">$4.2M</p>
<div class="flex items-center gap-1 mt-auto">
<span class="material-symbols-outlined text-status-positive text-[16px]">trending_up</span>
<span class="font-metadata text-metadata text-status-positive">+12% YTD</span>
</div>
</div>
<!-- Metric Card 2 -->
<div class="bg-surface border border-border-subtle rounded-lg p-sub-section-gap flex flex-col gap-2 shadow-sm">
<p class="font-metadata text-metadata text-text-secondary uppercase">Invoiced</p>
<p class="font-card-metric text-card-metric text-text-primary">$2.8M</p>
<div class="mt-auto h-1 w-full bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-primary-container w-[66%]"></div>
</div>
</div>
<!-- Metric Card 3 -->
<div class="bg-surface border border-border-subtle rounded-lg p-sub-section-gap flex flex-col gap-2 shadow-sm">
<p class="font-metadata text-metadata text-text-secondary uppercase">Paid</p>
<p class="font-card-metric text-card-metric text-text-primary">$2.1M</p>
<div class="mt-auto h-1 w-full bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-status-positive w-[75%]"></div>
</div>
</div>
<!-- Metric Card 4 -->
<div class="bg-tint-warning border border-border-subtle rounded-lg p-sub-section-gap flex flex-col gap-2 shadow-sm">
<p class="font-metadata text-metadata text-status-warning uppercase">Receivables</p>
<p class="font-card-metric text-card-metric text-status-warning">$700k</p>
<p class="font-metadata text-metadata text-status-warning mt-auto opacity-80">Requires attention</p>
</div>
<!-- Metric Card 5 -->
<div class="bg-surface border border-border-subtle rounded-lg p-sub-section-gap flex flex-col gap-2 shadow-sm">
<p class="font-metadata text-metadata text-text-secondary uppercase">Payables</p>
<p class="font-card-metric text-card-metric text-text-primary">$350k</p>
<p class="font-metadata text-metadata text-text-secondary mt-auto">Current month</p>
</div>
</div>
<!-- Asymmetric Layout: Attention Panels & Activity -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-section-gap">
<!-- Left Column: Risks & Actions (Span 2) -->
<div class="lg:col-span-2 flex flex-col gap-section-gap">
<!-- Attention Panel: Project Risks -->
<section class="bg-surface border border-border-subtle rounded-lg overflow-hidden flex flex-col">
<div class="px-sub-section-gap py-item-gap border-b border-border-subtle flex justify-between items-center bg-surface-container-lowest">
<h3 class="font-section-title text-section-title text-text-primary flex items-center gap-2">
<span class="material-symbols-outlined text-status-critical">warning</span>
                                Active Project Risks
                            </h3>
<button class="font-metadata text-metadata text-primary hover:text-primary-container transition-colors">View All</button>
</div>
<div class="divide-y divide-border-subtle">
<!-- Item 1 -->
<div class="p-sub-section-gap flex items-start justify-between hover:bg-surface-container-low transition-colors">
<div class="flex flex-col gap-1">
<p class="font-body text-body font-medium text-text-primary">Hudson Yards Tower B - Structural Review</p>
<p class="font-body text-body text-text-secondary">Delayed engineering sign-off affecting concrete pour schedule.</p>
</div>
<span class="px-2 py-1 rounded-DEFAULT bg-tint-critical text-status-critical font-metadata text-metadata">High Risk</span>
</div>
<!-- Item 2 -->
<div class="p-sub-section-gap flex items-start justify-between hover:bg-surface-container-low transition-colors">
<div class="flex flex-col gap-1">
<p class="font-body text-body font-medium text-text-primary">Miami Art Museum - Permitting</p>
<p class="font-body text-body text-text-secondary">City zoning board requested additional environmental study.</p>
</div>
<span class="px-2 py-1 rounded-DEFAULT bg-tint-warning text-status-warning font-metadata text-metadata">Medium Risk</span>
</div>
</div>
</section>
<!-- Data Table: Overdue Invoices -->
<section class="bg-surface border border-border-subtle rounded-lg overflow-hidden flex flex-col">
<div class="px-sub-section-gap py-item-gap border-b border-border-subtle flex justify-between items-center bg-surface-container-lowest">
<h3 class="font-section-title text-section-title text-text-primary">Aged Receivables (&gt;60 Days)</h3>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead class="bg-surface-container-low border-b border-border-subtle">
<tr>
<th class="px-sub-section-gap py-item-gap font-table-header text-table-header text-text-secondary uppercase">Client / Project</th>
<th class="px-sub-section-gap py-item-gap font-table-header text-table-header text-text-secondary uppercase">Invoice #</th>
<th class="px-sub-section-gap py-item-gap font-table-header text-table-header text-text-secondary uppercase">Days Aged</th>
<th class="px-sub-section-gap py-item-gap font-table-header text-table-header text-text-secondary uppercase text-right">Amount</th>
</tr>
</thead>
<tbody class="divide-y divide-border-subtle bg-surface">
<tr class="hover:bg-surface-container-low transition-colors">
<td class="px-sub-section-gap py-item-gap font-body text-body text-text-primary">Nexus Development / Seattle Campus</td>
<td class="px-sub-section-gap py-item-gap font-body text-body text-text-secondary">INV-2023-089</td>
<td class="px-sub-section-gap py-item-gap font-body text-body text-status-critical">92 Days</td>
<td class="px-sub-section-gap py-item-gap font-body text-body text-text-primary text-right font-medium">$125,000</td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors">
<td class="px-sub-section-gap py-item-gap font-body text-body text-text-primary">Apex Global / London HQ Refit</td>
<td class="px-sub-section-gap py-item-gap font-body text-body text-text-secondary">INV-2023-102</td>
<td class="px-sub-section-gap py-item-gap font-body text-body text-status-warning">65 Days</td>
<td class="px-sub-section-gap py-item-gap font-body text-body text-text-primary text-right font-medium">$84,500</td>
</tr>
</tbody>
</table>
</div>
</section>
</div>
<!-- Right Column: Documents & Activity (Span 1) -->
<div class="flex flex-col gap-section-gap">
<!-- Attention Panel: Missing Documents -->
<section class="bg-surface border border-border-subtle rounded-lg overflow-hidden flex flex-col">
<div class="px-sub-section-gap py-item-gap border-b border-border-subtle bg-surface-container-lowest">
<h3 class="font-section-title text-section-title text-text-primary flex items-center gap-2">
<span class="material-symbols-outlined text-text-secondary">description</span>
                                Missing Documents
                            </h3>
</div>
<div class="divide-y divide-border-subtle">
<div class="p-item-gap flex items-center justify-between hover:bg-surface-container-low transition-colors">
<div class="flex flex-col">
<p class="font-body text-body text-text-primary text-sm">Contract Addendum B</p>
<p class="font-metadata text-metadata text-text-secondary">Austin Tech Park</p>
</div>
<span class="px-2 py-0.5 rounded-DEFAULT bg-tint-critical text-status-critical font-metadata text-metadata text-[10px] uppercase tracking-wider">Missing</span>
</div>
<div class="p-item-gap flex items-center justify-between hover:bg-surface-container-low transition-colors">
<div class="flex flex-col">
<p class="font-body text-body text-text-primary text-sm">Insurance Cert - Subcontractor</p>
<p class="font-metadata text-metadata text-text-secondary">Tokyo Flagship Store</p>
</div>
<span class="px-2 py-0.5 rounded-DEFAULT bg-tint-critical text-status-critical font-metadata text-metadata text-[10px] uppercase tracking-wider">Missing</span>
</div>
</div>
</section>
<!-- Recent Activity Log -->
<section class="bg-surface border border-border-subtle rounded-lg overflow-hidden flex flex-col flex-1">
<div class="px-sub-section-gap py-item-gap border-b border-border-subtle bg-surface-container-lowest">
<h3 class="font-section-title text-section-title text-text-primary flex items-center gap-2">
<span class="material-symbols-outlined text-text-secondary">history</span>
                                Recent Activity
                            </h3>
</div>
<div class="p-sub-section-gap flex flex-col gap-item-gap relative">
<!-- Timeline line -->
<div class="absolute left-[27px] top-sub-section-gap bottom-sub-section-gap w-[1px] bg-border-subtle z-0"></div>
<!-- Log Item 1 -->
<div class="flex gap-3 relative z-10">
<div class="w-8 h-8 rounded-full bg-surface border border-border-subtle flex items-center justify-center shrink-0 mt-1">
<span class="material-symbols-outlined text-text-secondary text-[16px]">edit_document</span>
</div>
<div class="flex flex-col">
<p class="font-body text-body text-text-primary"><span class="font-medium">Sarah Jenkins</span> uploaded Design Dev Phase 2.</p>
<p class="font-metadata text-metadata text-text-tertiary">2 hours ago • Hudson Yards Tower B</p>
</div>
</div>
<!-- Log Item 2 -->
<div class="flex gap-3 relative z-10">
<div class="w-8 h-8 rounded-full bg-tint-positive border border-status-positive/20 flex items-center justify-center shrink-0 mt-1">
<span class="material-symbols-outlined text-status-positive text-[16px]">check_circle</span>
</div>
<div class="flex flex-col">
<p class="font-body text-body text-text-primary"><span class="font-medium">Client Approval</span> received for schematic layout.</p>
<p class="font-metadata text-metadata text-text-tertiary">4 hours ago • Austin Tech Park</p>
</div>
</div>
<!-- Log Item 3 -->
<div class="flex gap-3 relative z-10">
<div class="w-8 h-8 rounded-full bg-surface border border-border-subtle flex items-center justify-center shrink-0 mt-1">
<span class="material-symbols-outlined text-text-secondary text-[16px]">payments</span>
</div>
<div class="flex flex-col">
<p class="font-body text-body text-text-primary"><span class="font-medium">Invoice #104</span> generated for milestone 3.</p>
<p class="font-metadata text-metadata text-text-tertiary">Yesterday • Tokyo Flagship Store</p>
</div>
</div>
</div>
</section>
</div>
</div>
</main>
</div>
</body></html>`