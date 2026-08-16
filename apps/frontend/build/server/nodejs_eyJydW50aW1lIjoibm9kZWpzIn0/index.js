import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Link, Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, createContext, data, isRouteErrorResponse, redirect, useLocation, useNavigate, useNavigation, useRouteError, useSearchParams } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import * as React$1 from "react";
import React, { createContext as createContext$1, forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, ArrowUp, AudioLines, Bell, BookOpen, Bookmark, Bot, Briefcase, Bug, Building, Building2, Calendar, Camera, CheckCircle, CheckIcon, ChevronDown, ChevronDownIcon, ChevronRight, ChevronUp, ChevronUpIcon, Circle, Clock, Copyright, CreditCard, Download, Edit, ExternalLink, Eye, Facebook, File as File$1, FileSearch, FileText, Filter, Gavel, Github, Globe, Globe2, GraduationCap, Handshake, Heart, HeartHandshake, HelpCircle, History, Home, Info, Landmark, LayoutGrid, Library, List, Loader2, Lock, LogIn, LogOut, Mail, MapPin, Menu, MessageCircle, MoreVertical, PanelLeftIcon, Pencil, Phone, PhoneCall, Plus, RefreshCw, Scale, Search, Send, ServerCrash, Settings, Share, Share2, Shield, ShieldCheck, ShieldOff, ShieldQuestion, Sparkles, Trash2, Twitter, Upload, User, UserCircle, Users, WifiOff, X, XIcon } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { QueryCache, QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import { jwtVerify } from "jose";
import { initReactI18next, useTranslation } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm, useFormContext, useFormState } from "react-hook-form";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Zodios, makeApi } from "@zodios/core";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as TabsPrimitive from "@radix-ui/react-tabs";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region ../node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), 6e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region app/hooks/use-mobile.ts
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = React$1.useState(void 0);
	React$1.useEffect(() => {
		const mql = window.matchMedia(`(max-width: 767px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
//#endregion
//#region app/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region app/components/ui/button.tsx
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
			outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2 has-[>svg]:px-3",
			sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
			lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
			icon: "size-9",
			"icon-sm": "size-8",
			"icon-lg": "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		"data-slot": "button",
		"data-variant": variant,
		"data-size": size,
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
//#endregion
//#region app/components/ui/input.tsx
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ jsx("input", {
		type,
		"data-slot": "input",
		className: cn("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", className),
		...props
	});
}
//#endregion
//#region app/components/ui/separator.tsx
function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
	return /* @__PURE__ */ jsx(SeparatorPrimitive.Root, {
		"data-slot": "separator",
		decorative,
		orientation,
		className: cn("bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px", className),
		...props
	});
}
//#endregion
//#region app/components/ui/sheet.tsx
function Sheet({ ...props }) {
	return /* @__PURE__ */ jsx(SheetPrimitive.Root, {
		"data-slot": "sheet",
		...props
	});
}
function SheetPortal({ ...props }) {
	return /* @__PURE__ */ jsx(SheetPrimitive.Portal, {
		"data-slot": "sheet-portal",
		...props
	});
}
function SheetOverlay({ className, ...props }) {
	return /* @__PURE__ */ jsx(SheetPrimitive.Overlay, {
		"data-slot": "sheet-overlay",
		className: cn("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className),
		...props
	});
}
function SheetContent({ className, children, side = "right", ...props }) {
	return /* @__PURE__ */ jsxs(SheetPortal, { children: [/* @__PURE__ */ jsx(SheetOverlay, {}), /* @__PURE__ */ jsxs(SheetPrimitive.Content, {
		"data-slot": "sheet-content",
		className: cn("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500", side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm", side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm", side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b", side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t", className),
		...props,
		children: [children, /* @__PURE__ */ jsxs(SheetPrimitive.Close, {
			className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none",
			children: [/* @__PURE__ */ jsx(XIcon, { className: "size-4" }), /* @__PURE__ */ jsx("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function SheetHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sheet-header",
		className: cn("flex flex-col gap-1.5 p-4", className),
		...props
	});
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ jsx(SheetPrimitive.Title, {
		"data-slot": "sheet-title",
		className: cn("text-foreground font-semibold", className),
		...props
	});
}
function SheetDescription({ className, ...props }) {
	return /* @__PURE__ */ jsx(SheetPrimitive.Description, {
		"data-slot": "sheet-description",
		className: cn("text-muted-foreground text-sm", className),
		...props
	});
}
//#endregion
//#region app/components/ui/tooltip.tsx
function TooltipProvider({ delayDuration = 0, ...props }) {
	return /* @__PURE__ */ jsx(TooltipPrimitive.Provider, {
		"data-slot": "tooltip-provider",
		delayDuration,
		...props
	});
}
function Tooltip({ ...props }) {
	return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(TooltipPrimitive.Root, {
		"data-slot": "tooltip",
		...props
	}) });
}
function TooltipTrigger({ ...props }) {
	return /* @__PURE__ */ jsx(TooltipPrimitive.Trigger, {
		"data-slot": "tooltip-trigger",
		...props
	});
}
function TooltipContent({ className, sideOffset = 0, children, ...props }) {
	return /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsxs(TooltipPrimitive.Content, {
		"data-slot": "tooltip-content",
		sideOffset,
		className: cn("bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(TooltipPrimitive.Arrow, { className: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })]
	}) });
}
//#endregion
//#region app/components/ui/sidebar.tsx
var SIDEBAR_COOKIE_NAME = "sidebar_state";
var SIDEBAR_COOKIE_MAX_AGE = 604800;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var SIDEBAR_KEYBOARD_SHORTCUT = "b";
var SidebarContext = React$1.createContext(null);
function useSidebar() {
	const context = React$1.useContext(SidebarContext);
	if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
	return context;
}
function SidebarProvider({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }) {
	const isMobile = useIsMobile();
	const [openMobile, setOpenMobile] = React$1.useState(false);
	const [_open, _setOpen] = React$1.useState(defaultOpen);
	const open = openProp ?? _open;
	const setOpen = React$1.useCallback((value) => {
		const openState = typeof value === "function" ? value(open) : value;
		if (setOpenProp) setOpenProp(openState);
		else _setOpen(openState);
		document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
	}, [setOpenProp, open]);
	const toggleSidebar = React$1.useCallback(() => {
		return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
	}, [
		isMobile,
		setOpen,
		setOpenMobile
	]);
	React$1.useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggleSidebar();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [toggleSidebar]);
	const state = open ? "expanded" : "collapsed";
	const contextValue = React$1.useMemo(() => ({
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	}), [
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	]);
	return /* @__PURE__ */ jsx(SidebarContext.Provider, {
		value: contextValue,
		children: /* @__PURE__ */ jsx(TooltipProvider, {
			delayDuration: 0,
			children: /* @__PURE__ */ jsx("div", {
				"data-slot": "sidebar-wrapper",
				style: {
					"--sidebar-width": SIDEBAR_WIDTH,
					"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
					...style
				},
				className: cn("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full", className),
				...props,
				children
			})
		})
	});
}
function Sidebar({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }) {
	const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
	if (collapsible === "none") return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar",
		className: cn("bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col", className),
		...props,
		children
	});
	if (isMobile) return /* @__PURE__ */ jsx(Sheet, {
		open: openMobile,
		onOpenChange: setOpenMobile,
		...props,
		children: /* @__PURE__ */ jsxs(SheetContent, {
			"data-sidebar": "sidebar",
			"data-slot": "sidebar",
			"data-mobile": "true",
			className: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
			style: { "--sidebar-width": SIDEBAR_WIDTH_MOBILE },
			side,
			children: [/* @__PURE__ */ jsxs(SheetHeader, {
				className: "sr-only",
				children: [/* @__PURE__ */ jsx(SheetTitle, { children: "Sidebar" }), /* @__PURE__ */ jsx(SheetDescription, { children: "Displays the mobile sidebar." })]
			}), /* @__PURE__ */ jsx("div", {
				className: "flex h-full w-full flex-col",
				children
			})]
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "group peer text-sidebar-foreground hidden md:block",
		"data-state": state,
		"data-collapsible": state === "collapsed" ? collapsible : "",
		"data-variant": variant,
		"data-side": side,
		"data-slot": "sidebar",
		children: [/* @__PURE__ */ jsx("div", {
			"data-slot": "sidebar-gap",
			className: cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)")
		}), /* @__PURE__ */ jsx("div", {
			"data-slot": "sidebar-container",
			className: cn("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex", side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]", variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l", className),
			...props,
			children: /* @__PURE__ */ jsx("div", {
				"data-sidebar": "sidebar",
				"data-slot": "sidebar-inner",
				className: "bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm",
				children
			})
		})]
	});
}
function SidebarTrigger({ className, onClick, ...props }) {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ jsxs(Button, {
		"data-sidebar": "trigger",
		"data-slot": "sidebar-trigger",
		variant: "ghost",
		size: "icon",
		className: cn("size-7", className),
		onClick: (event) => {
			onClick?.(event);
			toggleSidebar();
		},
		...props,
		children: [/* @__PURE__ */ jsx(PanelLeftIcon, {}), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Toggle Sidebar"
		})]
	});
}
function SidebarInset({ className, ...props }) {
	return /* @__PURE__ */ jsx("main", {
		"data-slot": "sidebar-inset",
		className: cn("bg-background relative flex w-full flex-1 flex-col", "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2", className),
		...props
	});
}
function SidebarHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-header",
		"data-sidebar": "header",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
}
function SidebarFooter({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-footer",
		"data-sidebar": "footer",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
}
function SidebarContent({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-content",
		"data-sidebar": "content",
		className: cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className),
		...props
	});
}
function SidebarGroup({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-group",
		"data-sidebar": "group",
		className: cn("relative flex w-full min-w-0 flex-col p-2", className),
		...props
	});
}
function SidebarGroupLabel({ className, asChild = false, ...props }) {
	return /* @__PURE__ */ jsx(asChild ? Slot : "div", {
		"data-slot": "sidebar-group-label",
		"data-sidebar": "group-label",
		className: cn("text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className),
		...props
	});
}
function SidebarGroupContent({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-group-content",
		"data-sidebar": "group-content",
		className: cn("w-full text-sm", className),
		...props
	});
}
function SidebarMenu({ className, ...props }) {
	return /* @__PURE__ */ jsx("ul", {
		"data-slot": "sidebar-menu",
		"data-sidebar": "menu",
		className: cn("flex w-full min-w-0 flex-col gap-1", className),
		...props
	});
}
function SidebarMenuItem({ className, ...props }) {
	return /* @__PURE__ */ jsx("li", {
		"data-slot": "sidebar-menu-item",
		"data-sidebar": "menu-item",
		className: cn("group/menu-item relative", className),
		...props
	});
}
var sidebarMenuButtonVariants = cva("peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", {
	variants: {
		variant: {
			default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
			outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
		},
		size: {
			default: "h-8 text-sm",
			sm: "h-7 text-xs",
			lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function SidebarMenuButton({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }) {
	const Comp = asChild ? Slot : "button";
	const { isMobile, state } = useSidebar();
	const button = /* @__PURE__ */ jsx(Comp, {
		"data-slot": "sidebar-menu-button",
		"data-sidebar": "menu-button",
		"data-size": size,
		"data-active": isActive,
		className: cn(sidebarMenuButtonVariants({
			variant,
			size
		}), className),
		...props
	});
	if (!tooltip) return button;
	if (typeof tooltip === "string") tooltip = { children: tooltip };
	return /* @__PURE__ */ jsxs(Tooltip, { children: [/* @__PURE__ */ jsx(TooltipTrigger, {
		asChild: true,
		children: button
	}), /* @__PURE__ */ jsx(TooltipContent, {
		side: "right",
		align: "center",
		hidden: state !== "collapsed" || isMobile,
		...tooltip
	})] });
}
//#endregion
//#region app/components/ui/avatar.tsx
function Avatar({ className, ...props }) {
	return /* @__PURE__ */ jsx(AvatarPrimitive.Root, {
		"data-slot": "avatar",
		className: cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className),
		...props
	});
}
function AvatarImage({ className, ...props }) {
	return /* @__PURE__ */ jsx(AvatarPrimitive.Image, {
		"data-slot": "avatar-image",
		className: cn("aspect-square size-full", className),
		...props
	});
}
function AvatarFallback({ className, ...props }) {
	return /* @__PURE__ */ jsx(AvatarPrimitive.Fallback, {
		"data-slot": "avatar-fallback",
		className: cn("bg-muted flex size-full items-center justify-center rounded-full", className),
		...props
	});
}
//#endregion
//#region app/components/ui/dropdown-menu.tsx
function DropdownMenu({ ...props }) {
	return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Root, {
		"data-slot": "dropdown-menu",
		...props
	});
}
function DropdownMenuTrigger({ ...props }) {
	return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Trigger, {
		"data-slot": "dropdown-menu-trigger",
		...props
	});
}
function DropdownMenuContent({ className, sideOffset = 4, ...props }) {
	return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.Content, {
		"data-slot": "dropdown-menu-content",
		sideOffset,
		className: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md", className),
		...props
	}) });
}
function DropdownMenuGroup({ ...props }) {
	return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Group, {
		"data-slot": "dropdown-menu-group",
		...props
	});
}
function DropdownMenuItem({ className, inset, variant = "default", ...props }) {
	return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Item, {
		"data-slot": "dropdown-menu-item",
		"data-inset": inset,
		"data-variant": variant,
		className: cn("focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
		...props
	});
}
function DropdownMenuLabel({ className, inset, ...props }) {
	return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Label, {
		"data-slot": "dropdown-menu-label",
		"data-inset": inset,
		className: cn("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className),
		...props
	});
}
function DropdownMenuSeparator({ className, ...props }) {
	return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, {
		"data-slot": "dropdown-menu-separator",
		className: cn("bg-border -mx-1 my-1 h-px", className),
		...props
	});
}
//#endregion
//#region app/lib/nav/nav.paths.ts
function createPath(path, params = {}) {
	let renderedPath = path.startsWith("/") ? path : `/${path}`;
	Object.entries(params).forEach(([key, value]) => {
		renderedPath = renderedPath.replace(`:${key}`, String(value));
	});
	return renderedPath;
}
function defineRoutes(map) {
	const keys = Object.keys(map);
	const routes = {};
	const paths = {};
	const to = {};
	keys.forEach((k) => {
		const routePath = map[k].path;
		routes[k] = routePath;
		paths[k] = `/${routePath}`;
		to[k] = ((params) => createPath(routePath, params));
	});
	return {
		routes,
		paths,
		entries: keys.map((k) => ({
			path: map[k].path,
			file: map[k].file
		})),
		to
	};
}
var auth_default$1 = {
	login: {
		"title": "Login - Mahakama",
		"description": "Log in to your Mahakama account",
		"error": "Login failed. Please try again.",
		"invalidCredentials": "Invalid email or password. Please try again.",
		"signUpMessage": "Don't have an account?",
		"signUpLink": "Sign up"
	},
	signup: {
		"title": "Sign Up - Mahakama",
		"description": "Create a new Mahakama account",
		"error": "Registration failed. Please try again.",
		"invalidCredentials": "Invalid details provided. Please try again.",
		"loginMessage": "Have an account?",
		"loginLink": "Login"
	},
	forgotPassword: {
		"title": "Forgot Password - Mahakama",
		"description": "Reset your Mahakama account password",
		"label": "Account Recovery",
		"instruction": "Enter the email address associated with your account and we'll send you a link to reset your password.",
		"emailLabel": "Email Address",
		"emailPlaceholder": "name@example.com",
		"submitButton": "Send Reset Link",
		"backToLogin": "Back to Login",
		"successLabel": "Check Your Inbox",
		"successMessage": "A password reset link has been sent to",
		"spamNotice": "Please check your spam folder if you don't see it within a few minutes.",
		"tryDifferentEmail": "Try a different email"
	}
};
var auth_default = {
	login: {
		"title": "تسجيل الدخول - محكمة",
		"description": "سجل الدخول إلى حسابك في محكمة",
		"error": "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.",
		"invalidCredentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.",
		"signUpMessage": "ليس لديك حساب؟",
		"signUpLink": "إنشاء حساب"
	},
	signup: {
		"title": "إنشاء حساب - محكمة",
		"description": "أنشئ حساباً جديداً في محكمة",
		"error": "فشل التسجيل. يرجى المحاولة مرة أخرى.",
		"invalidCredentials": "البيانات المدخلة غير صحيحة. يرجى المحاولة مرة أخرى.",
		"loginMessage": "لديك حساب بالفعل؟",
		"loginLink": "تسجيل الدخول"
	},
	forgotPassword: {
		"title": "نسيت كلمة المرور - محكمة",
		"description": "إعادة تعيين كلمة مرور حسابك في محكمة",
		"label": "استعادة الحساب",
		"instruction": "أدخل عنوان البريد الإلكتروني المرتبط بحسابك وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.",
		"emailLabel": "عنوان البريد الإلكتروني",
		"emailPlaceholder": "name@example.com",
		"submitButton": "إرسال رابط الإعادة",
		"backToLogin": "العودة إلى تسجيل الدخول",
		"successLabel": "تحقق من صندوق الوارد",
		"successMessage": "تم إرسال رابط إعادة تعيين كلمة المرور إلى",
		"spamNotice": "يرجى التحقق من مجلد البريد العشوائي (Spam) إذا لم تره خلال بضع دقائق.",
		"tryDifferentEmail": "تجربة بريد إلكتروني آخر"
	}
};
defineRoutes({
	login: {
		path: "login",
		file: "routes/auth/login.tsx"
	},
	signup: {
		path: "signup",
		file: "routes/auth/signup.tsx"
	},
	forgotPassword: {
		path: "forgot-password",
		file: "routes/auth/forgot-password.tsx"
	}
}).to;
var AUTH_API_ROUTES = {
	ROOT: `/v1`,
	LOGIN: `/v1/login`,
	REGISTER: `/v1/register`,
	LOGOUT: `/v1/logout`
};
var authI18n = {
	namespace: "auth",
	resources: {
		en: auth_default$1,
		ar: auth_default
	}
};
//#endregion
//#region app/lib/api/api.utils.ts
function parseCookies(cookieHeader) {
	if (!cookieHeader) return {};
	return cookieHeader.split(";").map((cookie) => cookie.trim()).reduce((acc, cookie) => {
		const [key, value] = cookie.split("=");
		acc[key] = value;
		return acc;
	}, {});
}
function getAuthToken(request) {
	return parseCookies(request.headers.get("Cookie"))?.token ?? null;
}
var JWT_SECRET = new TextEncoder().encode("secret");
async function decodeJWT(token) {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET);
		return payload;
	} catch (error) {
		console.error("Failed to decode JWT:", error);
		return null;
	}
}
//#endregion
//#region app/lib/api/fetch.ts
var FetchApiClient = class FetchApiClient {
	baseURL;
	defaultHeaders;
	getClientToken() {
		if (typeof document === "undefined") return null;
		return parseCookies(document.cookie).token ?? null;
	}
	constructor(defaultHeaders = {}, baseURL) {
		this.baseURL = baseURL || "http://localhost:3000/api";
		this.defaultHeaders = defaultHeaders;
	}
	static withAuth(token) {
		return new FetchApiClient({ Authorization: `Bearer ${token}` });
	}
	async handleResponse(response) {
		if (!response.ok) {
			let errorData;
			try {
				errorData = await response.json();
			} catch {
				errorData = { errors: [{
					title: `Request failed with status ${response.status}`,
					detail: null,
					status: response.status.toString()
				}] };
			}
			throw new Error(errorData.errors?.[0]?.detail || `Request failed with status ${response.status}`);
		}
		return response.json();
	}
	async request(endpoint, options = {}, loaderToken) {
		const url = `${this.baseURL}${endpoint}`;
		const token = loaderToken || this.getClientToken();
		const headers = {
			"Content-Type": "application/json",
			...token ? { Authorization: `Bearer ${token}` } : {},
			...this.defaultHeaders,
			...options.headers
		};
		const response = await fetch(url, {
			...options,
			headers,
			credentials: "include"
		});
		return this.handleResponse(response);
	}
};
new FetchApiClient();
//#endregion
//#region app/lib/api/auth.api.ts
var AuthApiClient = class {
	api;
	constructor(apiClient) {
		if (apiClient) this.api = apiClient;
		else {
			const authBaseURL = "http://localhost:3000/auth";
			this.api = new FetchApiClient({}, authBaseURL);
		}
	}
	async makeRequest(endpoint, options = {}) {
		return await this.api.request(endpoint, {
			...options,
			credentials: "include"
		});
	}
	async login(credentials) {
		return await this.makeRequest(AUTH_API_ROUTES.LOGIN, {
			method: "POST",
			body: JSON.stringify(credentials),
			credentials: "include"
		});
	}
	async register(userAttrs) {
		return await this.makeRequest(AUTH_API_ROUTES.REGISTER, {
			method: "POST",
			body: JSON.stringify(userAttrs),
			credentials: "include"
		});
	}
	async logout() {
		await this.makeRequest(AUTH_API_ROUTES.LOGOUT, {
			method: "POST",
			credentials: "include"
		});
	}
};
var authApi = new AuthApiClient();
//#endregion
//#region app/feature/auth/hooks/use-auth.ts
function useLogin() {
	return useMutation({
		mutationFn: async (credentials) => {
			return await authApi.login(credentials);
		},
		onSuccess: (data) => {
			toast.success("Login successful!");
		},
		onError: (error) => {
			toast.error("Login failed. Please check your credentials.");
		}
	});
}
function useRegister() {
	return useMutation({
		mutationFn: async (userData) => {
			return await authApi.register(userData);
		},
		onSuccess: (data) => {
			toast.success("Registration successful!");
		},
		onError: (error) => {
			toast.error("Registration failed. Please try again.");
			console.error("Register error:", error);
		}
	});
}
function useLogout() {
	return useMutation({
		mutationFn: async () => {
			return await authApi.logout();
		},
		onSuccess: () => {
			toast.success("Logged out successfully!");
			window.location.href = "/login";
		},
		onError: (error) => {
			toast.error("Logout failed.");
		}
	});
}
//#endregion
//#region app/context/user-provider.tsx
var UserContext = createContext$1(void 0);
function UserProvider({ children, user }) {
	const logoutMutation = useLogout();
	const logout = () => {
		logoutMutation.mutate();
	};
	return /* @__PURE__ */ jsx(UserContext.Provider, {
		value: {
			user,
			logout
		},
		children
	});
}
function useUser() {
	const context = useContext(UserContext);
	if (context === void 0) throw new Error("useUser must be used within a UserProvider");
	return context;
}
//#endregion
//#region app/components/nav-user.tsx
function NavUser() {
	const { isMobile } = useSidebar();
	const { user } = useUser();
	const logoutMutation = useLogout();
	const userItems = [
		{
			id: "user-account",
			title: "Account",
			icon: User,
			url: "/users/profile"
		},
		{
			id: "user-settings",
			title: "Settings",
			icon: Settings,
			url: "/users/settings"
		},
		{
			id: "user-logout",
			title: "Sign out",
			icon: LogOut,
			action: "logout"
		}
	];
	const getInitials = (name, email) => {
		if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
		return email?.charAt(0).toUpperCase() || "U";
	};
	return /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ jsxs(SidebarMenuButton, {
			size: "lg",
			className: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border-2 border-gray-900 bg-white hover:bg-yellow-50 font-bold",
			style: {
				boxShadow: "2px 2px 0 0 #000",
				borderRadius: "4px 8px 4px 8px"
			},
			children: [
				/* @__PURE__ */ jsxs(Avatar, {
					className: "h-8 w-8 rounded-lg",
					children: [/* @__PURE__ */ jsx(AvatarImage, {
						src: user?.avatar,
						alt: user?.name || "User"
					}), /* @__PURE__ */ jsx(AvatarFallback, {
						className: "rounded-lg",
						children: getInitials(user?.name, user?.email)
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid flex-1 text-left text-sm leading-tight",
					children: [/* @__PURE__ */ jsx("span", {
						className: "truncate font-medium",
						children: user?.name || user?.email || "User"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-muted-foreground truncate text-xs",
						children: user?.email
					})]
				}),
				/* @__PURE__ */ jsx(MoreVertical, { className: "ml-auto size-4" })
			]
		})
	}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
		className: "w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
		side: isMobile ? "bottom" : "right",
		align: "end",
		sideOffset: 4,
		children: [
			/* @__PURE__ */ jsx(DropdownMenuLabel, {
				className: "p-0 font-normal",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 px-1 py-1.5 text-left text-sm",
					children: [/* @__PURE__ */ jsxs(Avatar, {
						className: "h-8 w-8 rounded-lg",
						children: [/* @__PURE__ */ jsx(AvatarImage, {
							src: user?.avatar,
							alt: user?.name || "User"
						}), /* @__PURE__ */ jsx(AvatarFallback, {
							className: "rounded-lg",
							children: getInitials(user?.name, user?.email)
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid flex-1 text-left text-sm leading-tight",
						children: [/* @__PURE__ */ jsx("span", {
							className: "truncate font-medium",
							children: user?.name || user?.email || "User"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-muted-foreground truncate text-xs",
							children: user?.email
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
			/* @__PURE__ */ jsx(DropdownMenuGroup, { children: userItems.map((item) => {
				const Icon = item.icon;
				if (item.action === "logout") return /* @__PURE__ */ jsxs(DropdownMenuItem, {
					onClick: () => logoutMutation.mutate(),
					className: "text-red-600 hover:bg-yellow-50 cursor-pointer",
					children: [/* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 mr-2" }), item.title]
				}, item.id);
				return /* @__PURE__ */ jsx(DropdownMenuItem, {
					asChild: true,
					children: /* @__PURE__ */ jsxs(NavLink, {
						to: item.url || "#",
						viewTransition: true,
						className: "flex items-center text-gray-900 hover:bg-yellow-50 cursor-pointer",
						children: [/* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 mr-2" }), item.title]
					})
				}, item.id);
			}) })
		]
	})] }) }) });
}
//#endregion
//#region app/components/onboarding-progress.tsx
function OnboardingProgress({ className = "" }) {
	const user = {
		name: "John Doe",
		email: "john@example.com",
		role: "user",
		age: 30,
		gender: "male",
		country: "Kenya",
		city: "Nairobi",
		bio: "Software developer",
		occupation: "Developer",
		isOnboarded: false
	};
	const [isCollapsed, setIsCollapsed] = useState(false);
	const navigate = useNavigate();
	const steps = [
		{
			id: "basic",
			title: "Basic Info",
			icon: User,
			completed: !!user?.name && !!user?.age && !!user?.gender,
			description: "Name, age, gender"
		},
		{
			id: "location",
			title: "Location",
			icon: MapPin,
			completed: !!user?.country && !!user?.city,
			description: "Country, city"
		},
		{
			id: "professional",
			title: "Professional",
			icon: Briefcase,
			completed: user?.role === "lawyer" ? true : true,
			description: user?.role === "lawyer" ? "Professional details" : "Not applicable"
		},
		{
			id: "enhancements",
			title: "Enhancements",
			icon: Sparkles,
			completed: !!user?.bio || !!user?.occupation,
			description: "Bio, occupation, photo"
		}
	];
	const completedSteps = steps.filter((step) => step.completed).length;
	const totalSteps = steps.length;
	const progressPercentage = completedSteps / totalSteps * 100;
	const handleStepClick = (stepId) => {
		navigate("/users/onboarding");
	};
	if (user?.isOnboarded) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: `bg-white border-2 border-gray-900 rounded-lg shadow-[2px_2px_0_0_#000] ${className}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "p-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-2",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-sm font-semibold text-gray-900",
					children: "Complete Your Profile"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "text-xs text-gray-600",
						children: [
							completedSteps,
							"/",
							totalSteps
						]
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setIsCollapsed(!isCollapsed),
						className: "p-1 hover:bg-gray-100 rounded transition-colors",
						children: isCollapsed ? /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 text-gray-600" }) : /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4 text-gray-600" })
					})]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "w-full bg-gray-200 rounded-full h-2",
				children: /* @__PURE__ */ jsx("div", {
					className: "bg-yellow-400 h-2 rounded-full transition-all duration-300",
					style: { width: `${progressPercentage}%` }
				})
			})]
		}), !isCollapsed && /* @__PURE__ */ jsxs("div", {
			className: "px-4 pb-4",
			children: [/* @__PURE__ */ jsx("div", {
				className: "space-y-2",
				children: steps.map((step, index) => /* @__PURE__ */ jsxs("div", {
					className: `flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors ${!step.completed ? "hover:bg-yellow-50" : ""}`,
					onClick: () => handleStepClick(step.id),
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex-1 min-w-0",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(step.icon, { className: "h-3 w-3 text-gray-600" }), /* @__PURE__ */ jsx("p", {
								className: "text-xs font-medium text-gray-900 truncate",
								children: step.title
							})]
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "flex-shrink-0",
						children: step.completed ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-600" }) : /* @__PURE__ */ jsx(Circle, { className: "h-4 w-4 text-gray-400" })
					})]
				}, step.id))
			}), completedSteps < totalSteps && /* @__PURE__ */ jsx("div", {
				className: "mt-3 pt-3 border-t border-gray-200",
				children: /* @__PURE__ */ jsx("p", {
					className: "text-xs text-gray-600",
					children: "Complete your profile to get the most out of Mahakama"
				})
			})]
		})]
	});
}
//#endregion
//#region app/components/SidebarNav.tsx
var SidebarNav = ({ links }) => {
	return /* @__PURE__ */ jsx(SidebarMenu, { children: links.map((item) => /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, {
		asChild: true,
		className: "mb-2",
		children: /* @__PURE__ */ jsxs(NavLink, {
			to: item.url,
			viewTransition: true,
			className: ({ isActive }) => {
				return isActive ? "bg-yellow-300" : "bg-green-300";
			},
			children: [/* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: item.title })]
		})
	}) }, item.id)) });
};
//#endregion
//#region app/components/app-sidebar.tsx
function AppSidebar({ navLinks }) {
	return /* @__PURE__ */ jsxs(Sidebar, {
		variant: "inset",
		children: [
			/* @__PURE__ */ jsx(SidebarHeader, {}),
			/* @__PURE__ */ jsx(SidebarContent, { children: /* @__PURE__ */ jsxs(SidebarGroup, { children: [/* @__PURE__ */ jsx(SidebarGroupLabel, { children: "Application" }), /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarNav, { links: navLinks }) })] }) }),
			/* @__PURE__ */ jsxs(SidebarFooter, {
				className: "py-4",
				children: [/* @__PURE__ */ jsx(OnboardingProgress, {}), /* @__PURE__ */ jsx(NavUser, {})]
			})
		]
	});
}
//#endregion
//#region app/components/notifications-dropdown.tsx
function NotificationsDropdown({ notifications = [], onMarkAsRead, onShowAll, className = "" }) {
	const unreadCount = notifications.filter((n) => !n.read).length;
	return /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative",
			children: [/* @__PURE__ */ jsx(Bell, { className: "h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" }), unreadCount > 0 && /* @__PURE__ */ jsx("span", {
				className: "absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold",
				children: unreadCount > 9 ? "9+" : unreadCount
			})]
		})
	}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
		className: "w-80 border-2 border-gray-900 bg-white",
		style: { boxShadow: "3px 3px 0 0 #000" },
		children: [
			/* @__PURE__ */ jsx(DropdownMenuLabel, {
				className: "text-sm font-medium text-gray-900",
				children: "Notifications"
			}),
			/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
			notifications.length === 0 ? /* @__PURE__ */ jsx("div", {
				className: "px-3 py-5 text-center text-sm text-gray-500",
				children: "No new notifications"
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [notifications.slice(0, 3).map((notification) => /* @__PURE__ */ jsx(DropdownMenuItem, {
				className: "flex flex-col items-start gap-1 p-3 hover:bg-gray-50",
				onClick: () => onMarkAsRead?.(notification.id),
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-2 w-full",
					children: [/* @__PURE__ */ jsx("div", {
						className: `w-2 h-2 rounded-full mt-1 flex-shrink-0 ${notification.read ? "bg-gray-300" : "bg-blue-500"}`,
						children: notification.read && /* @__PURE__ */ jsx(CheckCircle, { className: "w-2 h-2 text-white" })
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex-1 min-w-0",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium text-gray-900 line-clamp-1",
								children: notification.title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-gray-500 line-clamp-2",
								children: notification.description
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-gray-400 mt-1",
								children: notification.time
							})
						]
					})]
				})
			}, notification.id)), notifications.length > 3 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(DropdownMenuSeparator, {}), /* @__PURE__ */ jsx(DropdownMenuItem, {
				className: "px-3 py-2 text-center text-sm text-blue-600 hover:bg-blue-50 font-medium",
				onClick: onShowAll,
				children: "Show all notifications"
			})] })] })
		]
	})] });
}
//#endregion
//#region app/components/language-switcher.tsx
function LanguageSwitcher() {
	const { t, i18n: i18nInstance } = useTranslation("common");
	const currentLanguage = i18nInstance.language;
	const handleLanguageChange = (lng) => {
		i18nInstance.changeLanguage(lng);
		document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
		document.documentElement.lang = lng;
	};
	return /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ jsxs("button", {
			className: "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
			"aria-label": t("locale.switch", "Switch language"),
			children: [/* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
				className: "hidden sm:inline",
				children: currentLanguage === "ar" ? t("locale.ar") : t("locale.en")
			})]
		})
	}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
		align: "end",
		className: "min-w-[120px]",
		children: [/* @__PURE__ */ jsx(DropdownMenuItem, {
			className: currentLanguage === "en" ? "bg-accent" : "",
			onClick: () => handleLanguageChange("en"),
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("span", { children: t("locale.en") }), currentLanguage === "en" && /* @__PURE__ */ jsx("span", {
					className: "text-primary",
					children: "✓"
				})]
			})
		}), /* @__PURE__ */ jsx(DropdownMenuItem, {
			className: currentLanguage === "ar" ? "bg-accent" : "",
			onClick: () => handleLanguageChange("ar"),
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("span", { children: t("locale.ar") }), currentLanguage === "ar" && /* @__PURE__ */ jsx("span", {
					className: "text-primary",
					children: "✓"
				})]
			})
		})]
	})] });
}
//#endregion
//#region app/components/site-header.tsx
function SiteHeader({ title = "Documents" }) {
	return /* @__PURE__ */ jsx("header", {
		className: "flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) py-2 hidden md:flex",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex justify-between items-center w-full",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1 px-2 lg:gap-2 lg:px-6",
				children: [
					/* @__PURE__ */ jsx(SidebarTrigger, { className: "-ml-1" }),
					/* @__PURE__ */ jsx(Separator, {
						orientation: "vertical",
						className: "mx-2 data-[orientation=vertical]:h-4"
					}),
					/* @__PURE__ */ jsx(NavLink, {
						to: "/",
						viewTransition: true,
						className: "flex items-center gap-2 group",
						children: /* @__PURE__ */ jsx("span", {
							className: "text-base font-semibold",
							children: title
						})
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ jsx(NotificationsDropdown, {
						notifications: [
							{
								id: "1",
								title: "New document shared",
								description: "John Doe shared a legal document with you",
								time: "2 minutes ago",
								read: false
							},
							{
								id: "2",
								title: "Case update",
								description: "Your case status has been updated to 'In Progress'",
								time: "1 hour ago",
								read: false
							},
							{
								id: "3",
								title: "Appointment reminder",
								description: "You have a consultation scheduled for tomorrow at 2:00 PM",
								time: "3 hours ago",
								read: true
							}
						],
						onMarkAsRead: (id) => console.log("Mark as read:", id),
						onShowAll: () => console.log("Show all notifications")
					}),
					/* @__PURE__ */ jsx(LanguageSwitcher, {}),
					/* @__PURE__ */ jsxs(NavLink, {
						to: "/help",
						className: "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
						children: [/* @__PURE__ */ jsx(HelpCircle, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Help" })]
					}),
					/* @__PURE__ */ jsxs(NavLink, {
						to: "/contact",
						className: "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
						children: [/* @__PURE__ */ jsx(PhoneCall, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Contact Us" })]
					})
				]
			})]
		})
	});
}
//#endregion
//#region app/context/country-context.tsx
var CountryContext = createContext$1(void 0);
function CountryProvider({ children }) {
	const [selectedCountry, setSelectedCountry] = useState(null);
	return /* @__PURE__ */ jsx(CountryContext.Provider, {
		value: {
			selectedCountry,
			setSelectedCountry
		},
		children
	});
}
//#endregion
//#region app/components/navigation-loader.tsx
function NavigationLoader() {
	if (!(useNavigation().state === "loading")) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "fixed top-0 left-0 right-0 z-50",
		children: /* @__PURE__ */ jsxs("div", {
			className: "h-1 bg-gray-900 relative overflow-hidden",
			children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-700 to-transparent animate-pulse" }), /* @__PURE__ */ jsx("div", { className: "h-full w-32 bg-gray-900 animate-pulse" })]
		})
	});
}
//#endregion
//#region app/lib/nav/nav.config.ts
var BASE_NAV_LINKS = [{
	id: "nav-home",
	title: "nav.home",
	url: "/",
	icon: Home
}, {
	id: "nav-recents",
	title: "nav.recents",
	url: "/chats/recents",
	icon: History
}];
var APP_NAV_LINKS = [
	...BASE_NAV_LINKS,
	{
		id: "nav-find-lawyer",
		title: "nav.findLawyer",
		url: "/lawyers",
		icon: Users
	},
	{
		id: "nav-justice-hub",
		title: "nav.justiceHub",
		url: "/legal-hub",
		icon: Scale
	},
	{
		id: "nav-legal-database",
		title: "nav.legalDatabase",
		url: "/documents",
		icon: Library
	}
];
var LAWYER_NAV_LINKS = [
	...BASE_NAV_LINKS,
	{
		id: "nav-clients",
		title: "nav.clients",
		url: "/lawyer/clients",
		icon: Briefcase
	},
	{
		id: "nav-justice-hub",
		title: "nav.justiceHub",
		url: "/legal-hub",
		icon: Scale
	},
	{
		id: "nav-legal-database",
		title: "nav.legalDatabase",
		url: "/documents",
		icon: Library
	}
];
var ROLE_NAV_LINKS = {
	lawyer: LAWYER_NAV_LINKS,
	user: APP_NAV_LINKS
};
Array.from(new Map([...APP_NAV_LINKS, ...LAWYER_NAV_LINKS].map((item) => [item.id, item])).values());
//#endregion
//#region app/hooks/use-nav-links.ts
var useNavLinks = () => {
	const user = useUser();
	return useMemo(() => {
		const merged = [...ROLE_NAV_LINKS[user?.user?.role ?? "user"] ?? APP_NAV_LINKS];
		for (const base of BASE_NAV_LINKS) if (!merged.find((l) => l.id === base.id)) merged.push(base);
		return merged;
	}, [user?.user?.role]);
};
//#endregion
//#region app/layouts/AppShell.tsx
var AppShell = ({ children, pageTitle }) => {
	const navLinks = useNavLinks();
	return /* @__PURE__ */ jsxs(CountryProvider, { children: [/* @__PURE__ */ jsx(Toaster, {}), /* @__PURE__ */ jsxs("main", {
		className: "h-svh overflow-hidden",
		children: [/* @__PURE__ */ jsx(NavigationLoader, {}), /* @__PURE__ */ jsxs(SidebarProvider, { children: [/* @__PURE__ */ jsx(AppSidebar, { navLinks }), /* @__PURE__ */ jsxs(SidebarInset, { children: [/* @__PURE__ */ jsx(SiteHeader, { title: pageTitle }), children] })] })]
	})] });
};
//#endregion
//#region app/components/icon-container.tsx
var sizeVariants = {
	sm: {
		container: "w-6 h-6",
		icon: 12,
		border: "border",
		shadow: "shadow-[1.5px_1.5px_0_0_RGBA(0,0,0,1)]"
	},
	md: {
		container: "w-8 h-8",
		icon: 16,
		border: "border-2",
		shadow: "shadow-[2px_2px_0_0_RGBA(0,0,0,1)]"
	},
	lg: {
		container: "w-12 h-12",
		icon: 24,
		border: "border-2",
		shadow: "shadow-[3px_3px_0_0_RGBA(0,0,0,1)]"
	}
};
var colorVariants = {
	yellow: {
		bg: "bg-yellow-100",
		text: "text-yellow-700",
		border: "border-yellow-900"
	},
	blue: {
		bg: "bg-blue-50",
		text: "text-blue-700",
		border: "border-blue-900"
	},
	green: {
		bg: "bg-green-50",
		text: "text-green-700",
		border: "border-green-900"
	},
	red: {
		bg: "bg-red-50",
		text: "text-red-700",
		border: "border-red-900"
	},
	gray: {
		bg: "bg-gray-50",
		text: "text-gray-700",
		border: "border-gray-900"
	},
	outline: {
		bg: "bg-transparent",
		text: "text-gray-900",
		border: "border-gray-900"
	},
	handdrawn: {
		bg: "bg-gradient-to-br from-yellow-200 to-yellow-300",
		text: "text-gray-900",
		border: "border-gray-900"
	},
	"handdrawn-yellow": {
		bg: "bg-gradient-to-br from-yellow-200 to-yellow-300",
		text: "text-gray-900",
		border: "border-gray-900"
	},
	"handdrawn-blue": {
		bg: "bg-gradient-to-br from-blue-200 to-blue-300",
		text: "text-gray-900",
		border: "border-blue-900"
	}
};
var getHandDrawnStyles = (size = "md") => {
	return {
		container: `relative z-10 font-black ${{
			sm: "text-base w-8 h-8",
			md: "text-xl w-12 h-12",
			lg: "text-2xl w-14 h-14"
		}[size]} flex items-center justify-center rounded-full`,
		innerCircle: "absolute inset-0 rounded-full pointer-events-none border-2 border-dashed border-black/10",
		content: "relative z-10"
	};
};
var IconContainer = ({ icon: Icon, className = "", iconSize, size = "md", color = "yellow", number, text }) => {
	const variant = sizeVariants[size];
	if ([
		"handdrawn",
		"handdrawn-yellow",
		"handdrawn-blue"
	].includes(color)) {
		const styles = getHandDrawnStyles(size);
		const variantColors = colorVariants[color];
		return /* @__PURE__ */ jsxs("div", {
			className: cn(styles.container, variantColors.bg, variantColors.border, "border-2 shadow-[3px_3px_0_0_rgba(0,0,0,1)]", className),
			children: [/* @__PURE__ */ jsx("span", {
				className: styles.content,
				children: number || text || (Icon ? /* @__PURE__ */ jsx(Icon, {
					size: iconSize || variant.icon,
					width: iconSize || variant.icon,
					height: iconSize || variant.icon
				}) : null)
			}), /* @__PURE__ */ jsx("div", {
				className: styles.innerCircle,
				style: { transform: "rotate(15deg)" }
			})]
		});
	}
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex-shrink-0", className),
		children: /* @__PURE__ */ jsxs("div", {
			className: cn("rounded-full flex items-center justify-center", colorVariants[color]?.bg, colorVariants[color]?.border, variant.container, variant.border, variant.shadow),
			children: [
				Icon && /* @__PURE__ */ jsx(Icon, {
					size: iconSize || variant.icon,
					width: iconSize || variant.icon,
					height: iconSize || variant.icon,
					className: colorVariants[color]?.text
				}),
				number && /* @__PURE__ */ jsx("span", {
					className: colorVariants[color]?.text,
					children: number
				}),
				text && /* @__PURE__ */ jsx("span", {
					className: colorVariants[color]?.text,
					children: text
				})
			]
		})
	});
};
//#endregion
//#region app/layouts/header.tsx
var links$1 = [
	{
		id: 1,
		title: "Find a Lawyer",
		icon: Users,
		url: "/lawyers"
	},
	{
		id: 2,
		title: "Justice Hub",
		icon: Scale,
		url: "/legal-hub"
	},
	{
		id: 3,
		title: "Legal Database",
		icon: Library,
		url: "/documents"
	}
];
function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const menuRef = useRef(null);
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
		};
		if (isOpen) document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen]);
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") setIsOpen(false);
		};
		if (isOpen) document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen]);
	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};
	const closeMenu = () => {
		setIsOpen(false);
	};
	return /* @__PURE__ */ jsx("header", {
		className: `sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md ${isScrolled ? "shadow-[0_4px_0_0_rgba(0,0,0,0.1)]" : ""} transition-shadow duration-300`,
		style: {
			borderImageSource: "url(data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='%233b82f6' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E)",
			borderImageSlice: "1"
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full",
			children: [/* @__PURE__ */ jsx("div", {
				className: "w-full mx-auto px-4 sm:px-6 lg:px-12",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex sm:h-20 items-center justify-between",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "flex items-center flex-shrink-0 gap-2",
							children: /* @__PURE__ */ jsxs(NavLink, {
								to: "/",
								viewTransition: true,
								className: "flex items-center group",
								children: [/* @__PURE__ */ jsx(Scale, { className: "w-5 h-5 group-hover:rotate-12 transition-transform duration-300" }), /* @__PURE__ */ jsx("span", {
									className: "ml-2 sm:ml-3 text-lg sm:text-2xl font-black text-gray-900 font-serif",
									children: "Mahakama"
								})]
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "hidden md:flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide",
							children: [
								/* @__PURE__ */ jsx("nav", {
									className: "flex items-center gap-2",
									children: links$1.map((link) => {
										const Icon = link.icon;
										return /* @__PURE__ */ jsx(NavLink, {
											to: link.url,
											className: ({ isActive }) => `inline-flex items-center justify-center px-3 py-1.5 text-sm font-bold transition-colors 4px 8px 4px 8px 2px 2px 0 0 #000 ${isActive ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-2 border-gray-900" : "text-gray-700 hover:bg-yellow-100 hover:border-2 hover:border-gray-900"}`,
											style: ({ isActive }) => ({
												boxShadow: isActive ? "2px 2px 0 0 #000" : "none",
												borderRadius: isActive ? "4px 8px 4px 8px" : "4px 8px 4px 8px"
											}),
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
													className: "hidden lg:inline",
													children: link.title
												})]
											})
										}, link.id);
									})
								}),
								/* @__PURE__ */ jsx(LanguageSwitcher, {}),
								/* @__PURE__ */ jsxs(NavLink, {
									to: "/login",
									className: ({ isActive }) => `inline-flex items-center justify-center px-3 py-1.5 text-sm font-bold transition-colors ${isActive ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-2 border-gray-900" : "text-gray-700 hover:bg-yellow-50 hover:border-2 hover:border-gray-900"}`,
									style: ({ isActive }) => ({
										boxShadow: isActive ? "2px 2px 0 0 #000" : "2px 2px 0 0 #000",
										borderRadius: "4px 8px 4px 8px"
									}),
									children: [/* @__PURE__ */ jsx(LogIn, { className: "h-4 w-4 mr-1" }), /* @__PURE__ */ jsx("span", {
										className: "hidden lg:inline",
										children: "Log in"
									})]
								})
							]
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: toggleMenu,
							className: "md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors",
							"aria-label": "Toggle menu",
							"aria-expanded": isOpen,
							children: isOpen ? /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" })
						})
					]
				})
			}), isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 bg-black/50 z-30 md:hidden",
				onClick: closeMenu,
				"aria-hidden": "true"
			}), /* @__PURE__ */ jsx("div", {
				ref: menuRef,
				className: "fixed left-0 right-0 top-16 sm:top-20 max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-5rem)] bg-white border-t-2 border-gray-900 overflow-y-auto z-40 md:hidden animate-in slide-in-from-top-2 duration-300",
				children: /* @__PURE__ */ jsxs("nav", {
					className: "p-2",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-4",
						children: "Menu"
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-1",
						children: [
							links$1.map((link) => {
								const Icon = link.icon;
								return /* @__PURE__ */ jsx(NavLink, {
									to: link.url,
									className: ({ isActive }) => `flex items-center justify-between px-4 py-2.5 my-1 text-sm font-bold transition-colors ${isActive ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-2 border-gray-900" : "text-gray-700 hover:bg-yellow-50 hover:border-2 hover:border-gray-900"}`,
									style: ({ isActive }) => ({
										boxShadow: isActive ? "2px 2px 0 0 #000" : "none",
										borderRadius: isActive ? "4px 8px 4px 8px" : "0"
									}),
									onClick: closeMenu,
									children: ({ isActive }) => /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 flex-shrink-0" }), link.title]
									}), isActive && /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-gray-900" })] })
								}, link.id);
							}),
							/* @__PURE__ */ jsx("div", { className: "border-t border-gray-200 my-2" }),
							/* @__PURE__ */ jsx(LanguageSwitcher, {}),
							/* @__PURE__ */ jsx(NavLink, {
								to: "/login",
								className: ({ isActive }) => `flex items-center justify-between px-4 py-2.5 my-1 text-sm font-bold transition-colors ${isActive ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-2 border-gray-900" : "text-gray-700 hover:bg-yellow-50 hover:border-2 hover:border-gray-900"}`,
								style: ({ isActive }) => ({
									boxShadow: isActive ? "2px 2px 0 0 #000" : "none",
									borderRadius: isActive ? "4px 8px 4px 8px" : "0"
								}),
								onClick: closeMenu,
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx(LogIn, { className: "h-5 w-5 flex-shrink-0" }), "Log in"]
								})
							})
						]
					})]
				})
			})] })]
		})
	});
}
//#endregion
//#region app/components/ui/card-with-label.tsx
function CardWithLabel({ label, children, className = "", labelClassName = "" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: cn("w-full p-6 border-2 border-dashed border-gray-300 rounded relative", className),
		children: [/* @__PURE__ */ jsx("div", {
			className: cn("absolute -top-2 left-4 px-2 bg-white text-xs font-mono text-gray-500", labelClassName),
			children: label
		}), children]
	});
}
//#endregion
//#region app/layouts/footer.tsx
function Footer() {
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	return /* @__PURE__ */ jsx("footer", {
		className: "mt-auto pt-12",
		children: /* @__PURE__ */ jsxs(CardWithLabel, {
			label: "The Platform",
			className: "border-t-4 border-l-0 border-r-0 border-b-0 rounded-none bg-white",
			labelClassName: "bg-yellow-400 text-black border-2 border-black italic font-black uppercase text-xs",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 md:grid-cols-4 gap-12 py-8",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "md:col-span-2 space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "bg-black p-2 border-2 border-black shadow-[4px_4px_0_0_rgba(250,204,21,1)]",
									children: /* @__PURE__ */ jsx(Scale, {
										className: "text-white",
										size: 24
									})
								}), /* @__PURE__ */ jsx("p", {
									className: "text-3xl font-black italic uppercase tracking-tighter",
									children: "Mahakama"
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "font-bold text-sm max-w-sm leading-relaxed",
								children: "Empowering citizens in South Sudan and East Africa through AI-driven legal discovery and verified professional connections."
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-4",
								children: [
									/* @__PURE__ */ jsx(SocialLink, {
										icon: Twitter,
										href: "#"
									}),
									/* @__PURE__ */ jsx(SocialLink, {
										icon: Github,
										href: "#"
									}),
									/* @__PURE__ */ jsx(SocialLink, {
										icon: Mail,
										href: "#"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsx("h4", {
							className: "font-black uppercase text-xs tracking-widest text-zinc-400",
							children: "Application"
						}), /* @__PURE__ */ jsxs("ul", {
							className: "space-y-2 font-bold text-sm",
							children: [
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
									to: "/find-a-lawyer",
									className: "hover:underline decoration-yellow-400 decoration-2",
									children: "Find a Lawyer"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
									to: "/legal-database",
									className: "hover:underline decoration-yellow-400 decoration-2",
									children: "Legal Database"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
									to: "/justice-hub",
									className: "hover:underline decoration-yellow-400 decoration-2",
									children: "Justice Hub"
								}) })
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsx("h4", {
							className: "font-black uppercase text-xs tracking-widest text-zinc-400",
							children: "Resources"
						}), /* @__PURE__ */ jsxs("ul", {
							className: "space-y-2 font-bold text-sm",
							children: [
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
									to: "/help",
									className: "hover:underline decoration-yellow-400 decoration-2",
									children: "Help Center"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
									to: "/contact",
									className: "hover:underline decoration-yellow-400 decoration-2",
									children: "Contact Us"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
									to: "/terms",
									className: "hover:underline decoration-yellow-400 decoration-2",
									children: "Terms of Service"
								}) })
							]
						})]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-8 pt-8 border-t-4 border-black flex flex-col md:flex-row justify-between items-center gap-4 pb-4",
				children: [/* @__PURE__ */ jsxs("p", {
					className: "text-xs font-black uppercase italic",
					children: [
						"© ",
						currentYear,
						" Mahakama — Secure Justice Portal"
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 bg-zinc-100 px-3 py-1 border-2 border-black text-[10px] font-black uppercase",
					children: [/* @__PURE__ */ jsx(Shield, { size: 12 }), " Data Privacy Encrypted"]
				})]
			})]
		})
	});
}
function SocialLink({ icon: Icon, href }) {
	return /* @__PURE__ */ jsx("a", {
		href,
		className: "p-2 border-2 border-black hover:bg-yellow-400 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
		children: /* @__PURE__ */ jsx(Icon, { size: 18 })
	});
}
//#endregion
//#region app/layouts/WebsiteLayout.tsx
var WebsiteLayout = ({ children }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-6xl mx-auto",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsx("main", {
				className: "flex-1",
				children: children || /* @__PURE__ */ jsx(Outlet, {})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
};
//#endregion
//#region app/layouts/AuthLayout.tsx
var AuthLayout = ({ children }) => {
	return /* @__PURE__ */ jsx("div", {
		className: " bg-gradient-to-br from-blue-50 via-white to-indigo-50",
		children: /* @__PURE__ */ jsx("div", {
			className: "container mx-auto px-4 py-8 md:py-16",
			children: /* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-md",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-12",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "flex justify-center mb-6",
							children: /* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-30 animate-pulse" }), /* @__PURE__ */ jsx(IconContainer, {
									icon: Scale,
									size: "lg",
									color: "handdrawn"
								})]
							})
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "text-4xl md:text-5xl font-black text-gray-900 mb-2 font-serif",
							children: "Welcome Back"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-gray-600 text-lg",
							children: "Access your Mahakama account"
						})
					]
				}), children || /* @__PURE__ */ jsx(Outlet, {})]
			})
		})
	});
};
//#endregion
//#region app/lib/react-query/index.ts
var queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 3e5,
			refetchOnWindowFocus: false,
			retry: (failureCount, error) => {
				if (error && typeof error === "object" && "status" in error) {
					const status = error.status;
					if (status >= 400 && status < 500) return false;
				}
				return failureCount < 3;
			}
		},
		mutations: {
			retry: 1,
			onError: (error) => {
				const message = error instanceof Error ? error.message : "An error occurred";
				toast.error(message);
			}
		}
	},
	queryCache: new QueryCache({ onError: (error, query) => {
		if (query.meta?.errorToast) {
			const message = error instanceof Error ? error.message : "An error occurred";
			toast.error(message);
		}
	} })
});
//#endregion
//#region app/context/query-client-provider.tsx
function QueryClientProviderWrapper({ children }) {
	return /* @__PURE__ */ jsxs(QueryClientProvider, {
		client: queryClient,
		children: [children, false]
	});
}
//#endregion
//#region app/middleware/context.ts
var userContext = createContext(null);
var authContext = createContext({ token: null });
//#endregion
//#region app/config/routes.config.ts
var PUBLIC_ROUTES = [
	"/",
	"/about",
	"/contact",
	"/login",
	"/signup"
];
var AUTH_ROUTES = [
	"/app",
	"/documents",
	"/lawyers",
	"/chats",
	"/chat",
	"/legal-hub",
	"/users"
];
var ALL_ROUTES = [...PUBLIC_ROUTES, ...AUTH_ROUTES];
function capitalizeRouteName(route) {
	return route.replace(/^\//, "").split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
function getPageTitle(pathname) {
	if (pathname === "/") return "Home";
	const routePath = pathname.split("?")[0].split("#")[0];
	const matchedRoute = ALL_ROUTES.filter((route) => routePath.startsWith(route)).sort((a, b) => b.length - a.length)[0];
	if (matchedRoute) return capitalizeRouteName(matchedRoute);
	const firstSegment = routePath.split("/")[1];
	return firstSegment ? capitalizeRouteName(firstSegment) : "Mahakama";
}
function isAuthRoute(pathname) {
	return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}
function isAuthPageRoute(pathname) {
	return pathname.startsWith("/login") || pathname.startsWith("/signup");
}
//#endregion
//#region app/components/mah-button.tsx
var MahButton = forwardRef(({ variant = "secondary", onClick, href, key, className, children, ...props }, ref) => {
	const baseClasses = cn("flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-2 border-black rounded-lg text-gray-900", variant === "primary" ? "bg-yellow-300 shadow-[2px_2px_0_0_#000] translate-x-0 translate-y-0" : variant === "card" ? "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border-2 border-black rounded-lg bg-yellow-300 shadow-[3px_3px_0_0_#000] hover:bg-yellow-400 hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] w-full" : "bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:text-gray-900", className);
	if (href) return /* @__PURE__ */ jsx(NavLink, {
		ref,
		to: href,
		className: baseClasses,
		...props,
		viewTransition: true,
		children
	}, key);
	return /* @__PURE__ */ jsx(Button, {
		ref,
		onClick,
		className: baseClasses,
		...props,
		children
	}, key);
});
MahButton.displayName = "MahButton";
//#endregion
//#region app/components/async-state/ErrorState.tsx
var ErrorState$1 = ({ icon: Icon, title, iconColor = "yellow", details, actions, showReportButton = true }) => {
	const handleReport = () => {
		window.open(`mailto:support@mahakama.com?subject=${encodeURIComponent(title)} Issue`, "_blank");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "relative mb-8",
				children: /* @__PURE__ */ jsx(IconContainer, {
					icon: Icon,
					size: "lg",
					color: iconColor,
					className: "mb-8"
				})
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-4 px-2",
				children: title
			}),
			details && /* @__PURE__ */ jsx("div", {
				className: "w-full max-w-md bg-white border-2 border-dashed border-gray-300 rounded-lg px-6 py-4 mb-8 shadow-[2px_2px_0_0_#000]",
				children: /* @__PURE__ */ jsx("div", {
					className: "text-gray-700 text-sm md:text-base leading-relaxed",
					children: details
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col items-center gap-4 w-full max-w-xs md:max-w-none",
				children: [showReportButton && /* @__PURE__ */ jsxs(MahButton, {
					variant: "secondary",
					onClick: handleReport,
					className: "w-full md:w-auto",
					children: [/* @__PURE__ */ jsx(Bug, { className: "w-4 h-4" }), "Report Issue"]
				}), /* @__PURE__ */ jsx("div", {
					className: "w-full md:w-auto",
					children: actions
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-8 text-xs font-medium text-gray-400 uppercase tracking-widest",
				children: "Mahakama Legal Platform"
			})
		]
	});
};
//#endregion
//#region app/components/errors/ServerError.tsx
var ServerError = ({ icon, title, color, data }) => {
	return /* @__PURE__ */ jsx(ErrorState$1, {
		icon,
		title,
		iconColor: `text-${color}-600`,
		details: data,
		actions: /* @__PURE__ */ jsxs(Button, {
			onClick: () => window.location.reload(),
			className: "bg-red-600 hover:bg-red-700",
			children: [/* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4 mr-2" }), " Refresh Page"]
		})
	});
};
//#endregion
//#region app/lib/errors/errors.config.ts
var ERROR_MAP = {
	401: {
		icon: Lock,
		title: "Session Expired",
		description: "Your session has expired. Please log in again to continue.",
		color: "yellow"
	},
	403: {
		icon: ShieldOff,
		title: "Access Denied",
		description: "You don't have permission to view this page.",
		color: "orange"
	},
	404: {
		icon: Search,
		title: "Not Found",
		description: "The requested resource could not be found.",
		color: "gray"
	},
	503: {
		icon: WifiOff,
		title: "You're Offline",
		description: "Check your internet connection and try again.",
		color: "gray"
	},
	500: {
		icon: ServerCrash,
		title: "Something Went Wrong",
		description: "An unexpected error occurred on our end.",
		color: "red"
	}
};
var DEFAULT_ERROR = {
	icon: AlertCircle,
	title: "Unexpected Error",
	description: "An unexpected error occurred.",
	iconColor: "text-red-600",
	actionType: "reload"
};
//#endregion
//#region app/components/errors/OfflineError.tsx
var OfflineError = ({ icon, title, color, data }) => {
	return /* @__PURE__ */ jsx(ErrorState$1, {
		icon,
		title,
		iconColor: `text-${color}-500`,
		details: data,
		actions: /* @__PURE__ */ jsxs(Button, {
			onClick: () => window.location.reload(),
			className: "bg-gray-700 hover:bg-gray-800",
			children: [/* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4 mr-2" }), " Try Again"]
		})
	});
};
//#endregion
//#region app/components/errors/SessionExpiredError.tsx
var SessionExpiredError = ({ icon, title, color, data }) => {
	const navigate = useNavigate();
	return /* @__PURE__ */ jsx(ErrorState$1, {
		icon,
		title,
		iconColor: `text-${color}-500`,
		actions: /* @__PURE__ */ jsx(Button, {
			onClick: () => navigate("/login"),
			className: "bg-blue-600 hover:bg-blue-700",
			children: "Log in"
		})
	});
};
//#endregion
//#region app/components/errors/AccessDeniedError.tsx
var AccessDeniedError = ({ icon, title, color }) => {
	const navigate = useNavigate();
	return /* @__PURE__ */ jsx(ErrorState$1, {
		icon,
		title,
		iconColor: `text-${color}-500`,
		actions: /* @__PURE__ */ jsx(Button, {
			onClick: () => navigate(-1),
			className: "bg-orange-500 hover:bg-orange-600",
			children: "Go Back"
		})
	});
};
//#endregion
//#region app/components/errors/NotFoundError.tsx
var NotFoundError = ({ icon, title, color, data }) => /* @__PURE__ */ jsx(ErrorState$1, {
	icon,
	title,
	iconColor: `text-${color}-500`,
	details: data,
	actions: /* @__PURE__ */ jsx(NavLink, {
		to: "/",
		className: "px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors",
		viewTransition: true,
		children: "Go Home"
	})
});
//#endregion
//#region app/lib/errors/errors.registry.ts
var ERROR_COMPONENT_MAP = {
	401: SessionExpiredError,
	403: AccessDeniedError,
	404: NotFoundError,
	503: OfflineError,
	500: ServerError
};
//#endregion
//#region app/lib/errors/errors.utils.ts
function handleRouteError(error, context) {
	if (error instanceof Response) throw error;
	const err = error;
	const message = context ? `${context}: ` : "";
	if (err?.status === 401) throw new Response(`${message}${ERROR_MAP[401].description}`, { status: 401 });
	if (err?.status === 403) throw new Response(`${message}${ERROR_MAP[403].description}`, { status: 403 });
	if (err?.status === 404) throw new Response(`${message}${ERROR_MAP[404].description}`, { status: 404 });
	if (err?.name === "AbortError" || err?.code === "ETIMEDOUT") throw new Response(`${message}Request timed out.`, { status: 408 });
	if (!globalThis.navigator?.onLine || err instanceof TypeError || err?.message === "Failed to fetch" || err?.code === "ECONNREFUSED") throw new Response(`${message}${ERROR_MAP[503].description}`, { status: 503 });
	throw new Response(`${message}${ERROR_MAP[500].description}`, { status: 500 });
}
var getErrorComponent = (status) => {
	return status && ERROR_COMPONENT_MAP[status] || ServerError;
};
//#endregion
//#region app/components/errors/ErrorBoundary.tsx
var MahErrorBoundary = ({ status, data }) => {
	const ErrorComponent = getErrorComponent(status);
	const config = status && ERROR_MAP[status] || DEFAULT_ERROR;
	return /* @__PURE__ */ jsx(ErrorComponent, {
		...config,
		data
	});
};
var RootErrorBoundary = ({ error }) => {
	let status;
	let data;
	let stack;
	if (isRouteErrorResponse(error)) {
		status = error.status;
		data = error.data;
	} else if (error instanceof Error) stack = void 0;
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(MahErrorBoundary, {
		status,
		data
	}), stack && /* @__PURE__ */ jsx("pre", {
		className: "w-full p-4 overflow-x-auto text-xs",
		children: /* @__PURE__ */ jsx("code", { children: stack })
	})] });
};
var chats_default$1 = {
	"new": {
		"title": "New Chat - Mahakama",
		"description": "Start a new conversation with our legal AI assistant"
	},
	recents: {
		"title": "Recent Chats - Mahakama",
		"description": "View and resume your recent legal chat history"
	},
	chatDetail: {
		"title": "Chat Session - Mahakama",
		"description": "Continue your consultation with the legal assistant"
	},
	messages: {
		"title": "Messages - Mahakama",
		"description": "Manage your direct communications and messages"
	}
};
var chats_default = {
	"new": {
		"title": "محادثة جديدة - محكمة",
		"description": "ابدأ محادثة جديدة مع مساعد الذكاء الاصطناعي القانوني"
	},
	recents: {
		"title": "المحادثات الأخيرة - محكمة",
		"description": "عرض واستئناف سجل محادثاتك القانونية الأخيرة"
	},
	chatDetail: {
		"title": "جلسة المحادثة - محكمة",
		"description": "تابع استشارتك مع المساعد القانوني"
	},
	messages: {
		"title": "الرسائل - محكمة",
		"description": "إدارة اتصالاتك المباشرة ورسائلك"
	}
};
//#endregion
//#region app/feature/chats/ChatsConfig.ts
var API_V1$1 = "/api/v1";
defineRoutes({
	new: {
		path: "chats/new",
		file: "routes/chats/chats.new.tsx"
	},
	recents: {
		path: "chats/recents",
		file: "routes/chats/chats.recents.tsx"
	},
	chatDetail: {
		path: "chats/:chatId",
		file: "routes/chats/$chatId.tsx"
	}
}).to;
defineRoutes({
	index: {
		path: "messages",
		file: "routes/messages/index.tsx"
	},
	detail: {
		path: "messages/:conversationId",
		file: "routes/messages/conversationId.tsx"
	}
}).to;
`${API_V1$1}`, `${API_V1$1}`;
`${API_V1$1}`, `${API_V1$1}`, `${API_V1$1}`;
var chatsI18n = {
	namespace: "chats",
	resources: {
		en: chats_default$1,
		ar: chats_default
	}
};
var documents_default$2 = {
	index: {
		"title": "Legal Database - Mahakama",
		"description": "Explore and search legal documents, laws, and regulations"
	},
	detail: {
		"title": "Document Details - Mahakama",
		"description": "View and read detailed legal document contents and metadata"
	}
};
var documents_default$1 = {
	index: {
		"title": "قاعدة البيانات القانونية - محكمة",
		"description": "استكشف وابحث في المستندات القانونية والقوانين واللوائح"
	},
	detail: {
		"title": "تفاصيل المستند - محكمة",
		"description": "عرض وقراءة محتويات المستند القانوني والبيانات الوصفية بالتفصيل"
	}
};
defineRoutes({
	index: {
		path: "documents",
		file: "routes/documents/index.tsx"
	},
	detail: {
		path: "documents/:documentId",
		file: "routes/documents/$documentId.tsx"
	}
}).to;
var DOCUMENTS_API_ROUTES = {
	ROOT: "/v1/documents",
	DOCUMENT: "/v1/documents/:documentId",
	INGEST: "/v1/documents/ingest"
};
var documentsI18n = {
	namespace: "documents",
	resources: {
		en: documents_default$2,
		ar: documents_default$1
	}
};
var lawyers_default$2 = {
	index: {
		"title": "Find a Lawyer - Mahakama",
		"description": "Browse and connect with qualified lawyers and legal experts"
	},
	detail: {
		"title": "Lawyer Profile - Mahakama",
		"description": "View detailed information, credentials, and expertise of the lawyer"
	}
};
var lawyers_default$1 = {
	index: {
		"title": "البحث عن محامٍ - محكمة",
		"description": "تصفح وتواصل مع محامين مؤهلين وخبراء قانونيين"
	},
	detail: {
		"title": "ملف المحامي - محكمة",
		"description": "عرض معلومات تفصيلية ومؤهلات وخبرات المحامي"
	}
};
defineRoutes({
	index: {
		path: "lawyers",
		file: "routes/lawyers/index.tsx"
	},
	detail: {
		path: "lawyers/:lawyerId",
		file: "routes/lawyers/$lawyerId.tsx"
	}
}).to;
var LAWYERS_API_ROUTES = {
	ROOT: "/v1/lawyers",
	LAWYER: "/v1/lawyers/:lawyerId"
};
var lawyersI18n = {
	namespace: "lawyers",
	resources: {
		en: lawyers_default$2,
		ar: lawyers_default$1
	}
};
var notifications_default$2 = { index: {
	"title": "Notifications - Mahakama",
	"description": "View and manage your notifications"
} };
var notifications_default$1 = { index: {
	"title": "الإشعارات - محكمة",
	"description": "عرض وإدارة إشعاراتك"
} };
defineRoutes({ index: {
	path: "notifications",
	file: "routes/notifications/index.tsx"
} }).to;
var API_V1 = "/v1";
`${API_V1}`, `${API_V1}`;
var notificationsI18n = {
	namespace: "notifications",
	resources: {
		en: notifications_default$2,
		ar: notifications_default$1
	}
};
var users_default$1 = {
	profile: {
		"title": "User Profile - Mahakama",
		"description": "View and manage your Mahakama user profile"
	},
	settings: {
		"title": "Settings - Mahakama",
		"description": "Manage your Mahakama account preferences and settings"
	}
};
var users_default = {
	profile: {
		"title": "الملف الشخصي - محكمة",
		"description": "عرض وإدارة ملفك الشخصي في محكمة"
	},
	settings: {
		"title": "الإعدادات - محكمة",
		"description": "إدارة تفضيلات وإعدادات حسابك في محكمة"
	}
};
defineRoutes({
	profile: {
		path: "users/:profile",
		file: "routes/users/$profile.tsx"
	},
	settings: {
		path: "users/settings",
		file: "routes/users/settings.tsx"
	}
}).to;
var usersI18n = {
	namespace: "users",
	resources: {
		en: users_default$1,
		ar: users_default
	}
};
var website_default$1 = {
	about: {
		"title": "About Us - Mahakama",
		"description": "Learn more about Mahakama and our mission"
	},
	contact: {
		"title": "Contact Us - Mahakama",
		"description": "Get in touch with the Mahakama team"
	},
	legalHub: {
		"title": "Justice Hub - Mahakama",
		"description": "Explore justice resources and legal hub services"
	},
	serviceDetail: {
		"title": "Service Details - Mahakama",
		"description": "View detailed information about legal services"
	}
};
var website_default = {
	about: {
		"title": "من نحن - محكمة",
		"description": "تعرف على المزيد حول محكمة ورسالتنا"
	},
	contact: {
		"title": "اتصل بنا - محكمة",
		"description": "تواصل مع فريق محكمة"
	},
	legalHub: {
		"title": "مركز العدالة - محكمة",
		"description": "استكشف موارد العدالة وخدمات المركز القانوني"
	},
	serviceDetail: {
		"title": "تفاصيل الخدمة - محكمة",
		"description": "عرض معلومات تفصيلية حول الخدمات القانونية"
	}
};
defineRoutes({
	about: {
		path: "about",
		file: "routes/www/about.tsx"
	},
	contact: {
		path: "contact",
		file: "routes/www/contact.tsx"
	},
	legalHub: {
		path: "legal-hub",
		file: "routes/www/legal-hub.tsx"
	},
	serviceDetail: {
		path: "legal-hub/:serviceId",
		file: "routes/www/legal-hub/$serviceId.tsx"
	}
}).to;
//#endregion
//#region app/lib/i18n/index.ts
var resources = [
	authI18n,
	chatsI18n,
	documentsI18n,
	lawyersI18n,
	notificationsI18n,
	usersI18n,
	{
		namespace: "website",
		resources: {
			en: website_default$1,
			ar: website_default
		}
	}
].reduce((acc, Config) => {
	acc.en[Config.namespace] = Config.resources.en;
	acc.ar[Config.namespace] = Config.resources.ar;
	return acc;
}, {
	ar: { common: {
		signIn: "تسجيل الدخول",
		nav: {
			"home": "الرئيسية",
			"recents": "المحادثات الأخيرة",
			"findLawyer": "البحث عن محامٍ",
			"justiceHub": "مركز العدالة",
			"legalDatabase": "قاعدة البيانات القانونية",
			"clients": "العملاء",
			"group": "التطبيق"
		},
		userMenu: {
			"profile": "الملف الشخصي",
			"settings": "الإعدادات",
			"logout": "تسجيل الخروج"
		},
		locale: {
			"en": "EN",
			"ar": "AR",
			"switch": "تبديل اللغة"
		},
		actions: { "back": "رجوع" }
	} },
	en: { common: {
		signIn: "Sign In",
		nav: {
			"home": "Home",
			"recents": "Recent Chats",
			"findLawyer": "Find a Lawyer",
			"justiceHub": "Justice Hub",
			"legalDatabase": "Legal Database",
			"clients": "Clients",
			"group": "Application"
		},
		userMenu: {
			"profile": "Profile",
			"settings": "Settings",
			"logout": "Log out"
		},
		locale: {
			"en": "EN",
			"ar": "AR",
			"switch": "Switch language"
		},
		actions: { "back": "Back" }
	} }
});
i18n.use(LanguageDetector).use(initReactI18next).init({
	fallbackLng: "en",
	supportedLngs: ["en", "ar"],
	defaultNS: "common",
	ns: Object.keys(resources.en).sort(),
	resources,
	detection: {
		order: [
			"cookie",
			"localStorage",
			"navigator"
		],
		caches: ["cookie", "localStorage"]
	},
	interpolation: { escapeValue: false }
});
var i18n_default = i18n;
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$18,
	Layout: () => Layout,
	default: () => root_default,
	links: () => links,
	loader: () => loader$11,
	middleware: () => middleware
});
var links = () => [
	{
		rel: "preconnect",
		href: "https://fonts.googleapis.com"
	},
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous"
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
	}
];
async function loader$11({ context }) {
	return {
		user: context.get(userContext) || null,
		token: (context.get(authContext) || null)?.token
	};
}
function Layout({ children }) {
	useEffect(() => {
		document.documentElement.lang = i18n_default.language;
		document.documentElement.dir = i18n_default.dir();
	}, []);
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		className: "h-full",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", {
			className: "min-h-screen flex flex-col bg-background font-['Inter'] antialiased",
			children: [
				/* @__PURE__ */ jsx(QueryClientProviderWrapper, { children }),
				/* @__PURE__ */ jsx(ScrollRestoration, {}),
				/* @__PURE__ */ jsx(Scripts, {})
			]
		})]
	});
}
var root_default = UNSAFE_withComponentProps(function App() {
	const { user } = useLoaderData();
	const location = useLocation();
	const pageTitle = getPageTitle(location.pathname);
	const isAppRoute = isAuthRoute(location.pathname);
	const isAuthRoutePage = isAuthPageRoute(location.pathname);
	return /* @__PURE__ */ jsx(UserProvider, {
		user,
		children: isAuthRoutePage ? /* @__PURE__ */ jsx(AuthLayout, { children: /* @__PURE__ */ jsx(Outlet, {}) }) : isAppRoute ? /* @__PURE__ */ jsx(AppShell, {
			pageTitle,
			children: /* @__PURE__ */ jsx(Outlet, {})
		}) : /* @__PURE__ */ jsx(WebsiteLayout, { children: /* @__PURE__ */ jsx(Outlet, {}) })
	});
});
var ErrorBoundary$18 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary({ error }) {
	return /* @__PURE__ */ jsx(RootErrorBoundary, { error });
});
async function authMiddleware({ request, context }) {
	const token = getAuthToken(request);
	const pathname = new URL(request.url).pathname;
	if (pathname.startsWith("/login") || pathname.startsWith("/signup")) return;
	if (!token) return;
	try {
		const decodedToken = await decodeJWT(token);
		if (!decodedToken) return;
		const user = {
			id: decodedToken.sub,
			email: decodedToken.email,
			name: decodedToken.name,
			isOnboarded: decodedToken.isOnboarded
		};
		context.set(userContext, user);
		context.set(authContext, { token });
	} catch (error) {
		console.error("Auth middleware error:", error);
	}
}
var middleware = [authMiddleware];
//#endregion
//#region app/components/ui/hero-section-action.tsx
function HeroSectionAction({ variant = "cta", onSearch, searchPlaceholder = "Search..." }) {
	if (variant === "search") return /* @__PURE__ */ jsx("div", {
		className: "w-full max-w-2xl mx-auto",
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative",
			children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" }), /* @__PURE__ */ jsx(Input, {
				type: "search",
				placeholder: searchPlaceholder,
				className: "w-full pl-12 pr-6 py-4 text-base border-2 border-gray-900 rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900",
				style: { boxShadow: "3px 3px 0 0 #000" },
				onChange: (e) => onSearch?.(e.target.value)
			})]
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col sm:flex-row items-center justify-center gap-6",
		children: [/* @__PURE__ */ jsxs(NavLink, {
			to: "/app",
			className: ({ isActive }) => cn("relative px-6 py-3 text-sm font-bold text-gray-900 border-2 border-gray-900 bg-yellow-400 hover:bg-yellow-300 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-flex items-center", isActive ? "ring-2 ring-offset-2 ring-yellow-400" : ""),
			style: {
				borderRadius: "8px 16px 8px 16px",
				boxShadow: "3px 3px 0 0 #000"
			},
			children: [
				"Get Started",
				/* @__PURE__ */ jsx(ChevronRight, { className: "ml-2 h-4 w-4 inline-block" }),
				/* @__PURE__ */ jsx("span", { className: "absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900" }),
				/* @__PURE__ */ jsx("span", { className: "absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900" })
			]
		}), /* @__PURE__ */ jsxs(NavLink, {
			to: "#how-it-works",
			className: ({ isActive }) => cn("group relative px-6 py-3 text-sm font-bold text-gray-900 border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-0.5 inline-flex items-center gap-2", isActive ? "ring-2 ring-offset-2 ring-gray-200" : "", { "ml-4": true }),
			style: {
				borderRadius: "8px 16px 8px 16px",
				boxShadow: "3px 3px 0 0 #000"
			},
			children: ["Learn more", /* @__PURE__ */ jsx("svg", {
				className: "w-5 h-5 transform group-hover:translate-x-1 transition-transform",
				fill: "none",
				stroke: "currentColor",
				viewBox: "0 0 24 24",
				xmlns: "http://www.w3.org/2000/svg",
				style: { strokeWidth: "2.5" },
				children: /* @__PURE__ */ jsx("path", {
					strokeLinecap: "round",
					strokeLinejoin: "round",
					d: "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
				})
			})]
		})]
	});
}
//#endregion
//#region app/components/ui/specialization-button.tsx
var specializationColors = [
	{
		text: "text-blue-900",
		icon: "text-blue-900"
	},
	{
		text: "text-green-900",
		icon: "text-green-900"
	},
	{
		text: "text-purple-900",
		icon: "text-purple-900"
	},
	{
		text: "text-amber-900",
		icon: "text-amber-900"
	},
	{
		text: "text-rose-900",
		icon: "text-rose-900"
	},
	{
		text: "text-emerald-900",
		icon: "text-emerald-900"
	},
	{
		text: "text-indigo-900",
		icon: "text-indigo-900"
	},
	{
		text: "text-cyan-900",
		icon: "text-cyan-900"
	},
	{
		text: "text-fuchsia-900",
		icon: "text-fuchsia-900"
	},
	{
		text: "text-lime-900",
		icon: "text-lime-900"
	}
];
var getColor = (index) => {
	return specializationColors[index % specializationColors.length];
};
function SpecializationButton({ name, icon: Icon, index, className }) {
	const color = getColor(index);
	return /* @__PURE__ */ jsxs("button", {
		className: cn("w-full sm:w-auto text-left py-1.5 sm:py-1 px-3 border-2 border-gray-900 bg-white", "transition-all hover:shadow-md font-medium text-xs sm:text-sm flex items-center gap-2", "active:translate-y-0.5 active:shadow-none hover:bg-gray-50", color.text, className),
		style: {
			boxShadow: "2px 2px 0 0 #000",
			borderRadius: "4px 8px 4px 8px"
		},
		children: [/* @__PURE__ */ jsx(Icon, { className: cn("w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0", color.icon) }), /* @__PURE__ */ jsx("span", {
			className: "truncate",
			children: name
		})]
	});
}
//#endregion
//#region app/layouts/HeroSection.tsx
var specializations = [
	{
		name: "Family Law",
		icon: Users
	},
	{
		name: "Criminal Defense",
		icon: Gavel
	},
	{
		name: "Corporate Law",
		icon: Briefcase
	},
	{
		name: "Real Estate",
		icon: Home
	},
	{
		name: "Intellectual Property",
		icon: Copyright
	},
	{
		name: "Immigration",
		icon: Landmark
	},
	{
		name: "Personal Injury",
		icon: FileText
	},
	{
		name: "Tax Law",
		icon: Handshake
	},
	{
		name: "Employment Law",
		icon: Briefcase
	},
	{
		name: "Human Rights",
		icon: Shield
	}
];
var LegalSpecializations = ({ specializations }) => /* @__PURE__ */ jsxs("div", {
	className: "hidden sm:block pt-4 w-full",
	children: [/* @__PURE__ */ jsxs("div", {
		className: "max-w-3xl mx-auto text-center mb-6",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider mb-2",
			children: "Browse by Specialization"
		}), /* @__PURE__ */ jsx("p", {
			className: "text-sm text-gray-600 max-w-2xl mx-auto px-4",
			children: "Find legal help tailored to your specific needs."
		})]
	}), /* @__PURE__ */ jsx("div", {
		className: "grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-3 px-2 sm:px-0",
		children: specializations.map(({ name, icon }, index) => /* @__PURE__ */ jsx(SpecializationButton, {
			name,
			icon,
			index
		}, index))
	})]
});
function HeroSection({ title, description, className, actionVariant = "cta", onSearch, searchPlaceholder, icon: Icon = Scale }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("bg-background relative w-full overflow-hidden", className),
		children: /* @__PURE__ */ jsx("div", {
			className: "py-8 sm:py-24",
			children: /* @__PURE__ */ jsxs("div", {
				className: "text-center space-y-8",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "flex justify-center",
								children: /* @__PURE__ */ jsx(IconContainer, {
									icon: Icon,
									color: "handdrawn",
									size: "lg"
								})
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "text-4xl font-bold tracking-tight text-foreground sm:text-6xl",
								children: title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-lg leading-8 text-muted-foreground max-w-3xl mx-auto",
								children: description
							})
						]
					}),
					/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(HeroSectionAction, {
						variant: actionVariant,
						onSearch,
						searchPlaceholder
					}) }),
					/* @__PURE__ */ jsx(LegalSpecializations, { specializations })
				]
			})
		})
	});
}
//#endregion
//#region app/components/diagnoal-separator.tsx
var DiagonalSeparator = ({ className, height = "h-4" }) => {
	return /* @__PURE__ */ jsx("div", {
		className: cn("max-w-6xl mx-auto bg-repeat-x", height, className),
		style: {
			backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 8px,
          #e5e7eb 8px,
          #e5e7eb 16px
        )`,
			opacity: .5
		}
	});
};
//#endregion
//#region app/components/countries.tsx
var countries = [
	{
		name: "South Sudan",
		flag: "🇸🇸"
	},
	{
		name: "Uganda",
		flag: "🇺🇬"
	},
	{
		name: "Kenya",
		flag: "🇰🇪"
	},
	{
		name: "Tanzania",
		flag: "🇹🇿"
	},
	{
		name: "Rwanda",
		flag: "🇷🇼"
	},
	{
		name: "Burundi",
		flag: "🇧🇮"
	}
];
var CountryItem = ({ country }) => /* @__PURE__ */ jsx("button", {
	className: "p-4 border-2 border-gray-900 bg-white hover:bg-gray-50 transition-all text-gray-700 hover:text-gray-900",
	style: {
		boxShadow: "2px 2px 0 0 #000",
		borderRadius: "4px 8px 4px 8px"
	},
	children: /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center gap-2",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-4xl",
			children: country.flag
		}), /* @__PURE__ */ jsx("div", {
			className: "flex items-center gap-1",
			children: /* @__PURE__ */ jsx("span", {
				className: "text-sm font-medium",
				children: country.name
			})
		})]
	})
});
var SupportedCountries = () => {
	return /* @__PURE__ */ jsx("section", {
		className: "w-full px-4 sm:px-6 lg:px-8 py-16",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ jsx(IconContainer, {
						icon: Globe2,
						color: "outline",
						size: "lg"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-10",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-3xl font-bold text-gray-900 mb-4",
						children: "Operating Across East Africa"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-lg text-gray-600 max-w-2xl mx-auto",
						children: "Our legal network spans the entire East African region, providing seamless support for businesses operating across multiple jurisdictions."
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
					children: countries.map((country, index) => /* @__PURE__ */ jsx(CountryItem, { country }, index))
				})
			]
		})
	});
};
//#endregion
//#region app/components/call-to-action.tsx
var CallToAction = () => {
	return /* @__PURE__ */ jsx("div", {
		className: "bg-white py-16",
		children: /* @__PURE__ */ jsxs("div", {
			className: "container mx-auto px-4 text-center space-y-4",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ jsx(IconContainer, {
						icon: Scale,
						color: "outline",
						size: "lg"
					})
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-3xl font-bold mb-4",
					children: "Ready to get started?"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-gray-600 mb-8 max-w-2xl mx-auto",
					children: "Join thousands of users who are already using Mahakama to understand their legal rights and access legal services."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto",
					children: [/* @__PURE__ */ jsx(Button, {
						asChild: true,
						size: "lg",
						variant: "outline",
						className: "group flex-1 border-2 border-gray-900 bg-white hover:bg-gray-50 text-gray-900 hover:text-gray-900 font-medium py-6 px-6 rounded-lg transition-all duration-200 hover:shadow-md",
						children: /* @__PURE__ */ jsxs(NavLink, {
							viewTransition: true,
							to: "/app/citizen",
							className: "flex items-center justify-center gap-2",
							children: [
								/* @__PURE__ */ jsx(Scale, { className: "h-5 w-5" }),
								/* @__PURE__ */ jsx("span", { children: "I'm a Citizen" }),
								/* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" })
							]
						})
					}), /* @__PURE__ */ jsx(Button, {
						asChild: true,
						size: "lg",
						className: "flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-6 px-6 rounded-lg transition-all duration-200 hover:shadow-md",
						children: /* @__PURE__ */ jsxs(NavLink, {
							viewTransition: true,
							to: "/app/legal-professional",
							className: "flex items-center justify-center gap-2",
							children: [
								/* @__PURE__ */ jsx(Gavel, { className: "h-5 w-5" }),
								/* @__PURE__ */ jsx("span", { children: "I'm a Legal Professional" }),
								/* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" })
							]
						})
					})]
				})
			]
		})
	});
};
//#endregion
//#region app/feature/www/components/features.tsx
var features$1 = [
	{
		id: "find-answers",
		icon: Search,
		title: "Find Legal Answers",
		description: "Get clear, easy-to-understand answers to your legal questions in minutes, not hours.",
		href: "/"
	},
	{
		id: "legal-library",
		icon: Library,
		title: "Legal Library",
		description: "Access a comprehensive library of legal documents, forms, and resources at your fingertips.",
		href: "/documents"
	},
	{
		id: "connect-experts",
		icon: Users,
		title: "Connect with Experts",
		description: "Get personalized guidance from vetted legal professionals when you need it most.",
		href: "/lawyers"
	}
];
var MahakamaFeatures = () => {
	return /* @__PURE__ */ jsx("div", {
		className: "bg-white py-16",
		children: /* @__PURE__ */ jsxs("div", {
			className: "container mx-auto px-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "text-center max-w-3xl mx-auto mb-16 space-y-4",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "flex justify-center",
						children: /* @__PURE__ */ jsx(IconContainer, {
							icon: FileText,
							color: "outline",
							size: "lg"
						})
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4",
						children: "Your Legal Journey, Simplified"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-lg text-gray-600",
						children: "Access the legal resources and support you need, whether you're facing a legal issue or just need information. Our platform makes the law accessible to everyone."
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid md:grid-cols-3 gap-8 max-w-6xl mx-auto",
				children: features$1.map((feature) => /* @__PURE__ */ jsx(CardWithLabel, {
					label: feature.title,
					className: cn("border-solid group transition-all duration-200 transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]", "flex gap-4 h-full"),
					children: /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(IconContainer, {
								icon: feature.icon,
								size: "md",
								color: "outline"
							}) }),
							" ",
							/* @__PURE__ */ jsxs("h3", {
								className: "text-lg font-black text-gray-900 mb-2 relative inline-block",
								children: [feature.title, /* @__PURE__ */ jsx("div", { className: "absolute -bottom-0.5 left-0 right-0 h-1.5 bg-yellow-200/60 -rotate-1 -z-10" })]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-gray-600 leading-relaxed",
								children: feature.description
							}),
							/* @__PURE__ */ jsx(NavLink, {
								to: feature.href,
								className: "p-2 inline-flex items-center justify-center px-3 py-1.5 text-sm font-bold transition-colors 4px 8px 4px 8px 2px 2px 0 0 #000",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: ["Learn More ", /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2" })]
								})
							})
						]
					})
				}, feature.id))
			})]
		})
	});
};
//#endregion
//#region app/feature/www/screens/HomeScreen.tsx
var HomeScreen = () => {
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 max-w-7xl mx-auto space-y-8 ",
		children: [
			/* @__PURE__ */ jsx(HeroSection, {
				title: /* @__PURE__ */ jsxs(Fragment, { children: [
					"Legal Knowledge and",
					" ",
					/* @__PURE__ */ jsxs("span", {
						className: "relative inline-block",
						children: [/* @__PURE__ */ jsx("span", {
							className: "relative z-10",
							children: "Access"
						}), /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 right-0 h-3 bg-yellow-200/60 -rotate-1 -z-0" })]
					}),
					" ",
					"for Everyone"
				] }),
				description: "Free, easy-to-understand legal information for South Sudan and Uganda.",
				icon: Scale
			}),
			/* @__PURE__ */ jsx(MahakamaFeatures, {}),
			/* @__PURE__ */ jsx(SupportedCountries, {}),
			/* @__PURE__ */ jsx(CallToAction, {})
		]
	});
};
//#endregion
//#region app/components/errors/useAppError.ts
var useAppError = () => {
	const error = useRouteError();
	if (isRouteErrorResponse(error)) return {
		status: error.status,
		data: error.data
	};
	return { status: 500 };
};
//#endregion
//#region app/routes/index.tsx
var routes_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$17,
	default: () => routes_default,
	loader: () => loader$10,
	meta: () => meta$21
});
function meta$21({}) {
	return [{ title: "Mahakama - Legal Knowledge and Access for Everyone" }, {
		name: "description",
		content: "Access free legal information and resources for South Sudan and Uganda. Understand your rights in simple language."
	}];
}
async function loader$10({ context }) {
	try {
		const user = context.get(userContext);
		const token = context.get(authContext)?.token || null;
		const isAuth = user && token;
		if (isAuth) return redirect("/app");
		return {
			user: null,
			isAuth
		};
	} catch (error) {
		handleRouteError(error, "Failed to load mahakama");
	}
}
var routes_default = UNSAFE_withComponentProps(function Mahakama({ loaderData }) {
	const { user, isAuth } = loaderData;
	if (isAuth) return redirect("/app");
	console.log("User is not authenticated", user, isAuth);
	return /* @__PURE__ */ jsx(HomeScreen, {});
});
var ErrorBoundary$17 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/components/faq.tsx
var faqItems = [
	{
		question: "How can I find information about my legal issue?",
		answer: "You can use our search feature to find relevant legal information, browse our legal library by category, or connect with a legal professional for personalized guidance."
	},
	{
		question: "Is the legal information on this website up to date?",
		answer: "We strive to keep all legal information current and accurate. Our content is regularly reviewed by legal professionals, but laws can change, so we recommend consulting with a lawyer for the most current advice."
	},
	{
		question: "How do I contact a lawyer through your platform?",
		answer: "You can browse our directory of legal professionals and contact them directly through their profiles. Some lawyers offer free initial consultations."
	},
	{
		question: "Is my personal information kept confidential?",
		answer: "Yes, we take your privacy seriously. All personal information is protected under our privacy policy and we use industry-standard security measures to keep your data safe."
	},
	{
		question: "Do I need to pay to use this service?",
		answer: "Basic access to legal information and resources is free. Some services, like consultations with legal professionals, may have associated fees which will be clearly indicated."
	},
	{
		question: "Can I get help with court forms?",
		answer: "Yes, we provide access to common legal forms and step-by-step guidance on how to complete them. However, for complex legal matters, we recommend consulting with an attorney."
	}
];
var FAQSection = () => {
	const [openIndex, setOpenIndex] = useState(0);
	const toggleAccordion = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "bg-gray-50 py-16 px-4 sm:px-6 lg:px-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-4xl mx-auto",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-12 space-y-4",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "flex justify-center",
							children: /* @__PURE__ */ jsx(IconContainer, {
								icon: HelpCircle,
								color: "outline",
								size: "lg"
							})
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-3xl font-extrabold text-gray-900 sm:text-4xl",
							children: "Frequently Asked Questions"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-4 text-lg text-gray-600",
							children: "Find answers to common questions about our legal services and resources."
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "space-y-4",
					children: faqItems.map((item, index) => /* @__PURE__ */ jsxs("div", {
						className: cn("bg-white border-2 border-gray-900 rounded-lg overflow-hidden transition-all duration-200", openIndex === index ? "shadow-[4px_4px_0_0_rgba(0,0,0,1)]" : "hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]"),
						children: [/* @__PURE__ */ jsxs("button", {
							className: "w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none",
							onClick: () => toggleAccordion(index),
							"aria-expanded": openIndex === index,
							"aria-controls": `faq-${index}`,
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-lg font-semibold text-gray-900",
								children: item.question
							}), openIndex === index ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-5 w-5 text-gray-600" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-5 w-5 text-gray-600" })]
						}), /* @__PURE__ */ jsx("div", {
							id: `faq-${index}`,
							className: cn("px-6 pb-4 pt-0 transition-all duration-200", openIndex === index ? "block" : "hidden"),
							"aria-hidden": openIndex !== index,
							children: /* @__PURE__ */ jsx("p", {
								className: "text-gray-600",
								children: item.answer
							})
						})]
					}, index))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-12 text-center",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-gray-600 mb-4",
						children: "Still have questions? We're here to help."
					}), /* @__PURE__ */ jsx("a", {
						href: "/contact",
						className: "inline-flex items-center px-6 py-3 border-2 border-gray-900 text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
						children: "Contact Support"
					})]
				})
			]
		})
	});
};
//#endregion
//#region app/feature/www/layouts/website.layout.tsx
var website_layout_exports = /* @__PURE__ */ __exportAll({ default: () => website_layout_default });
var website_layout_default = UNSAFE_withComponentProps(function WebsiteLayout(props) {
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(Outlet, {}),
		/* @__PURE__ */ jsx(FAQSection, {}),
		/* @__PURE__ */ jsx(Footer, {})
	] });
});
//#endregion
//#region app/feature/www/components/about/Intro.tsx
var AboutIntro = () => {
	return /* @__PURE__ */ jsxs("div", {
		className: "text-muted-foreground mx-auto space-y-4",
		children: [
			/* @__PURE__ */ jsx(IconContainer, {
				icon: Info,
				size: "lg",
				color: "handdrawn",
				className: "mb-2"
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "text-2xl font-semibold text-foreground",
				children: "Legal Knowledge, Made Simple"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "prose prose-lg space-y-2",
				children: [
					/* @__PURE__ */ jsx("p", { children: "In South Sudan and Uganda, accessing legal information is often expensive and confusing. Government legal databases exist, but they're filled with complex terminology that's hard to understand without a law degree." }),
					/* @__PURE__ */ jsx("p", { children: "Mahakama changes that. Our AI-powered platform is completely free and lets you search using everyday language. Don't know the legal term for your issue? No problem. Just describe your situation as you would to a friend, and we'll find the relevant laws and regulations for you." }),
					/* @__PURE__ */ jsx("p", { children: "While we can connect you with legal professionals if absolutely necessary, our primary goal is to empower you with knowledge first. Most legal questions can be resolved by understanding your rights and options - no lawyer required." })
				]
			})
		]
	});
};
//#endregion
//#region app/feature/www/components/about/FeatureCard.tsx
function FeatureCard({ title, description, icon: Icon, className }) {
	return /* @__PURE__ */ jsxs("div", {
		className: cn("relative p-4 bg-white border-2 border-gray-900 group transition-all duration-200 transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]", "flex gap-4 h-full", className),
		style: {
			borderRadius: "16px 8px 16px 8px",
			border: "2px solid #000",
			boxShadow: "4px 4px 0 0 #000"
		},
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute -right-2 -top-2 w-3 h-3 border-t-2 border-r-2 border-gray-900 bg-yellow-300" }),
			/* @__PURE__ */ jsx("div", { className: "absolute -left-2 -bottom-2 w-3 h-3 border-b-2 border-l-2 border-gray-900 bg-yellow-300" }),
			/* @__PURE__ */ jsx("div", {
				className: "flex-shrink-0 mt-1",
				children: /* @__PURE__ */ jsx(IconContainer, {
					icon: Icon,
					size: "lg",
					color: "outline"
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-1 flex flex-col min-w-0",
				children: [
					/* @__PURE__ */ jsxs("h3", {
						className: "text-lg font-black text-gray-900 mb-2 relative inline-block",
						children: [title, /* @__PURE__ */ jsx("div", { className: "absolute -bottom-0.5 left-0 right-0 h-1.5 bg-yellow-200/60 -rotate-1 -z-10" })]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-gray-700 text-sm leading-relaxed",
						children: description
					}),
					/* @__PURE__ */ jsx("div", {
						className: "w-full h-0.5 bg-gray-200 mt-3",
						style: { clipPath: "polygon(0% 0%, 100% 0%, 98% 100%, 2% 100%)" }
					})
				]
			})
		]
	});
}
//#endregion
//#region app/feature/www/components/about/FeaturesGrid.tsx
function FeaturesGrid({ features, className }) {
	return /* @__PURE__ */ jsxs("div", {
		className: cn("w-full", className),
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-8",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "inline-flex items-center justify-center mb-4",
					children: /* @__PURE__ */ jsx(IconContainer, {
						icon: Heart,
						color: "handdrawn",
						className: "mx-auto shadow-[2px_2px_0_0_#000]"
					})
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-3xl font-bold text-foreground mb-4",
					children: "Why Choose Mahakama?"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-muted-foreground",
					children: "We're making legal information accessible and understandable for everyone in East Africa"
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-start",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "text-muted-foreground space-y-6",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "w-12 h-12 rounded-full bg-yellow-100 border-2 border-gray-900 flex items-center justify-center mb-4",
						style: { boxShadow: "3px 3px 0 0 #000" },
						children: /* @__PURE__ */ jsx(Info, { className: "w-5 h-5 text-gray-900" })
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-3xl font-bold text-foreground",
						children: "Legal Knowledge, Made Simple"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "prose prose-lg space-y-4",
						children: [
							/* @__PURE__ */ jsx("p", { children: "In South Sudan and Uganda, accessing legal information is often expensive and confusing. Government legal databases exist, but they're filled with complex terminology that's hard to understand without a law degree." }),
							/* @__PURE__ */ jsx("p", { children: "Mahakama changes that. Our AI-powered platform is completely free and lets you search using everyday language. Don't know the legal term for your issue? No problem. Just describe your situation as you would to a friend, and we'll find the relevant laws and regulations for you." }),
							/* @__PURE__ */ jsx("p", { children: "While we can connect you with legal professionals if absolutely necessary, our primary goal is to empower you with knowledge first. Most legal questions can be resolved by understanding your rights and options - no lawyer required." })
						]
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "space-y-6",
				children: features.map((feature, index) => /* @__PURE__ */ jsx(FeatureCard, {
					title: feature.title,
					description: feature.description,
					icon: feature.icon,
					className: "w-full"
				}, index))
			})]
		})]
	});
}
//#endregion
//#region app/feature/www/components/about/LegalServicesSection.tsx
function LegalServicesSection({ services = [], ctaText, ctaHref, className }) {
	return /* @__PURE__ */ jsxs("section", {
		className: cn("py-16 bg-white relative overflow-hidden", className),
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute -right-20 -top-20 w-64 h-64 rounded-full bg-yellow-100/50 -z-10" }),
			/* @__PURE__ */ jsx("div", { className: "absolute -left-10 bottom-10 w-32 h-32 rounded-full bg-blue-100/50 -z-10" }),
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-16 space-y-4",
						children: [
							/* @__PURE__ */ jsx(IconContainer, {
								icon: Gavel,
								color: "handdrawn"
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "text-4xl font-black text-gray-900 sm:text-5xl",
								children: "Legal Services"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-lg text-gray-700 font-medium",
								children: "Expert legal assistance when you need it most. Our network of verified professionals is here to help."
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
						children: services.map((service, index) => /* @__PURE__ */ jsxs("div", {
							className: "relative p-6 bg-white border-2 border-gray-900 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-y-1",
							style: {
								borderRadius: "16px 8px 16px 8px",
								border: "2px solid #000",
								boxShadow: "4px 4px 0 0 #000"
							},
							children: [
								/* @__PURE__ */ jsx("div", { className: "absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900 bg-yellow-300" }),
								/* @__PURE__ */ jsx("div", { className: "absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900 bg-yellow-300" }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-col h-full",
									children: [
										/* @__PURE__ */ jsx(IconContainer, {
											icon: service.icon,
											color: "outline"
										}),
										/* @__PURE__ */ jsxs("h3", {
											className: "text-xl font-black text-gray-900 mb-3 relative inline-block",
											children: [service.title, /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1 left-0 right-0 h-2 bg-yellow-200/60 -rotate-1 -z-10" })]
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-gray-700 mb-6 flex-grow",
											children: service.description
										}),
										/* @__PURE__ */ jsxs("a", {
											href: ctaHref,
											className: "mt-auto inline-flex items-center text-sm font-bold text-gray-900 hover:text-blue-600 group transition-colors",
											children: ["Learn more", /* @__PURE__ */ jsx(ChevronRight, { className: "ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" })]
										})
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute bottom-0 left-0 right-0 h-1 bg-gray-200",
									style: { clipPath: "polygon(0% 0%, 100% 0%, 98% 100%, 2% 100%)" }
								})
							]
						}, index))
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-16 text-center",
						children: /* @__PURE__ */ jsxs("a", {
							href: ctaHref,
							className: "relative px-6 py-3 text-sm font-bold text-gray-900 border-2 border-gray-900 bg-yellow-400 hover:bg-yellow-300 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-flex items-center",
							style: {
								borderRadius: "8px 16px 8px 16px",
								boxShadow: "3px 3px 0 0 #000"
							},
							children: [
								ctaText,
								/* @__PURE__ */ jsx("span", { className: "absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900" }),
								/* @__PURE__ */ jsx("span", { className: "absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900" }),
								/* @__PURE__ */ jsx(ArrowRight, {
									className: "ml-2 h-5 w-5",
									"aria-hidden": "true"
								})
							]
						})
					})
				]
			})
		]
	});
}
LegalServicesSection.defaultProps = { services: [
	{
		title: "Legal Consultation",
		description: "Get expert advice from our network of experienced attorneys.",
		icon: Gavel
	},
	{
		title: "Document Review",
		description: "Have your legal documents reviewed by professionals.",
		icon: FileText
	},
	{
		title: "Case Representation",
		description: "Professional representation for your legal matters.",
		icon: Scale
	}
] };
//#endregion
//#region app/feature/www/components/about/StepCard.tsx
var stepIcons = {
	1: Search,
	2: FileText,
	3: MessageCircle
};
function StepCard({ number, title, description }) {
	const Icon = stepIcons[number];
	return /* @__PURE__ */ jsxs("li", {
		className: "relative p-6 bg-white border-2 border-gray-900 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-y-1",
		style: {
			borderRadius: "16px 8px 16px 8px",
			border: "2px solid #000",
			boxShadow: "4px 4px 0 0 #000"
		},
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900 bg-yellow-300" }),
			/* @__PURE__ */ jsx("div", { className: "absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900 bg-yellow-300" }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-4",
				children: [/* @__PURE__ */ jsx(IconContainer, {
					icon: Icon,
					size: "lg",
					color: "outline",
					className: "mb-2"
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [/* @__PURE__ */ jsxs("h3", {
						className: "text-xl font-black text-gray-900 relative inline-block",
						children: [title, /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1 left-0 right-0 h-2 bg-yellow-200/60 -rotate-1 -z-10" })]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-gray-700 mt-3 font-medium",
						children: description
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute bottom-0 left-0 right-0 h-1 bg-gray-200",
				style: { clipPath: "polygon(0% 0%, 100% 0%, 98% 100%, 2% 100%)" }
			})
		]
	});
}
//#endregion
//#region app/feature/www/components/about/StepsSection.tsx
function StepsSection({ title, steps, footerText, icon: Icon, description }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [
					Icon && /* @__PURE__ */ jsx(IconContainer, {
						icon: Icon,
						size: "lg",
						color: "handdrawn",
						className: "mb-2"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-3xl font-bold text-foreground",
						children: title
					}),
					description && /* @__PURE__ */ jsx("p", {
						className: "text-lg text-muted-foreground max-w-3xl",
						children: description
					})
				]
			}),
			/* @__PURE__ */ jsx("ul", {
				className: "grid md:grid-cols-3 gap-6",
				children: steps.map((step) => /* @__PURE__ */ jsx(StepCard, {
					number: step.number,
					title: step.title,
					description: step.description
				}, step.number))
			}),
			footerText && /* @__PURE__ */ jsx("p", {
				className: "text-center text-muted-foreground text-sm mt-6",
				children: footerText
			})
		]
	});
}
//#endregion
//#region app/feature/www/screens/AboutScreen.tsx
var features = [
	{
		title: "Natural Language Search",
		description: "Search using everyday language - no legal jargon required. Ask questions like 'What should I do if my landlord changes the locks?' and get relevant legal information.",
		icon: Search
	},
	{
		title: "East Africa Focus",
		description: "Currently covering South Sudan and Uganda, with plans to expand across East Africa. All legal information is locally relevant and up-to-date.",
		icon: Globe
	},
	{
		title: "100% Free & Accessible",
		description: "Completely free to use with no hidden costs. We believe in making legal knowledge accessible to everyone, regardless of their financial situation.",
		icon: Clock
	}
];
var steps = [
	{
		number: 1,
		title: "Ask Your Question",
		description: "Type your legal question in everyday language, just like you'd ask a friend"
	},
	{
		number: 2,
		title: "Get Clear Answers",
		description: "Receive relevant legal information without confusing legal jargon"
	},
	{
		number: 3,
		title: "Understand Your Rights",
		description: "Learn what your rights are and what actions you can take next"
	}
];
var legalServices = [
	{
		title: "Legal Consultation",
		description: "Get personalized advice from experienced lawyers in our network",
		icon: Gavel
	},
	{
		title: "Document Review",
		description: "Have legal documents reviewed by professionals",
		icon: FileText
	},
	{
		title: "Case Representation",
		description: "Find representation for your legal matters when needed",
		icon: Scale
	}
];
var AboutScreen = () => {
	return /* @__PURE__ */ jsx("div", {
		className: "w-full py-12 px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-6xl mx-auto space-y-12",
			children: [
				/* @__PURE__ */ jsx(HeroSection, {
					title: "Free Legal Knowledge for East Africa",
					description: "Get clear answers to your legal questions in plain language. No legal background needed, and it's completely free.",
					icon: BookOpen
				}),
				/* @__PURE__ */ jsx(DiagonalSeparator, {}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-16",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-8",
							children: [/* @__PURE__ */ jsx(AboutIntro, {}), /* @__PURE__ */ jsx(StepsSection, {
								title: "Get Legal Answers in 3 Simple Steps",
								icon: Search,
								description: "Mahakama is a free legal knowledge platform for East Africa. Get clear answers to your legal questions in plain language. No legal background needed, and it's completely free.",
								steps,
								footerText: "Only if your situation is complex, we can help you find a lawyer in our network"
							})]
						}),
						/* @__PURE__ */ jsx(FeaturesGrid, { features }),
						/* @__PURE__ */ jsx(LegalServicesSection, {
							services: legalServices,
							ctaText: "Browse Legal Professionals",
							ctaHref: "/lawyers"
						})
					]
				})
			]
		})
	});
};
//#endregion
//#region app/routes/www/about.tsx
var about_exports = /* @__PURE__ */ __exportAll({
	default: () => about_default,
	meta: () => meta$20
});
function meta$20({}) {
	return [
		{ title: "About Mahakama - Empowering East Africa with Legal Knowledge" },
		{
			name: "description",
			content: "Learn how Mahakama is democratizing legal access in South Sudan and Uganda through AI-powered legal assistance. Our mission is to make legal knowledge free and understandable for everyone."
		},
		{
			name: "keywords",
			content: "about Mahakama, legal empowerment Africa, free legal information South Sudan, Uganda legal rights, legal education, law in East Africa, legal technology"
		},
		{
			name: "og:title",
			content: "About Mahakama - Legal Empowerment for East Africa"
		},
		{
			name: "og:description",
			content: "Discover how Mahakama is transforming legal access in South Sudan and Uganda with free, easy-to-understand legal information powered by AI technology."
		},
		{
			name: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:title",
			content: "About Mahakama - Legal Knowledge for Everyone"
		},
		{
			name: "twitter:description",
			content: "Empowering citizens in South Sudan and Uganda with free, accessible legal information through AI technology."
		}
	];
}
var about_default = UNSAFE_withComponentProps(AboutScreen);
//#endregion
//#region app/feature/www/screens/ContactScreen.tsx
var ContactScreen = () => {
	return /* @__PURE__ */ jsxs("div", {
		className: "container mx-auto p-6 space-y-12",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-2",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-4xl uppercase",
				children: "Get in Touch"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-muted-foreground max-w-2xl",
				children: "Whether you are a legal professional managing cases or a user seeking justice across East Africa, our regional teams are ready to assist."
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid lg:grid-cols-3 gap-8",
			children: [/* @__PURE__ */ jsx("div", {
				className: "lg:col-span-2",
				children: /* @__PURE__ */ jsx(CardWithLabel, {
					label: "Message",
					className: "h-full",
					children: /* @__PURE__ */ jsxs("form", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-bold uppercase tracking-wider",
										children: "First Name"
									}), /* @__PURE__ */ jsx("input", {
										className: "w-full p-3 border-2 border-black rounded focus:ring-2 focus:ring-yellow-400 outline-none",
										placeholder: "Emmanuel"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-bold uppercase tracking-wider",
										children: "Last Name"
									}), /* @__PURE__ */ jsx("input", {
										className: "w-full p-3 border-2 border-black rounded focus:ring-2 focus:ring-yellow-400 outline-none",
										placeholder: "Gatwech"
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-bold uppercase tracking-wider",
									children: "Email Address"
								}), /* @__PURE__ */ jsx("input", {
									type: "email",
									className: "w-full p-3 border-2 border-black rounded focus:ring-2 focus:ring-yellow-400 outline-none",
									placeholder: "emmanuel@mahakama.com"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-bold uppercase tracking-wider",
									children: "Regional Subject"
								}), /* @__PURE__ */ jsxs("select", {
									className: "w-full p-3 border-2 border-black rounded bg-white font-bold",
									children: [
										/* @__PURE__ */ jsx("option", { children: "General Inquiry" }),
										/* @__PURE__ */ jsx("option", { children: "Justice Hub Assistance (South Sudan)" }),
										/* @__PURE__ */ jsx("option", { children: "Legal Database Request (Uganda/Kenya)" }),
										/* @__PURE__ */ jsx("option", { children: "Lawyer Verification Support" }),
										/* @__PURE__ */ jsx("option", { children: "Case Management Technical Help" })
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-bold uppercase tracking-wider",
									children: "Your Message"
								}), /* @__PURE__ */ jsx("textarea", {
									rows: 4,
									className: "w-full p-3 border-2 border-black rounded focus:ring-2 focus:ring-yellow-400 outline-none",
									placeholder: "Tell us how we can help..."
								})]
							}),
							/* @__PURE__ */ jsxs("button", {
								className: "w-full flex items-center justify-center gap-2 bg-yellow-400 text-black font-black uppercase py-4 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1",
								children: [/* @__PURE__ */ jsx(Send, { size: 20 }), "Send to Mahakama Support"]
							})
						]
					})
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ jsx(CardWithLabel, {
					label: "Regional Presence",
					children: /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ jsx(Globe, { className: "shrink-0 text-yellow-500" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "font-bold text-sm",
									children: "East African Support"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: "South Sudan, Kenya, Uganda, Rwanda, Tanzania"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ jsx(MapPin, { className: "shrink-0 text-yellow-500" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "font-bold text-sm",
									children: "Headquarters"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: "Kigali, Rwanda"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ jsx(Mail, { className: "shrink-0 text-yellow-500" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "font-bold text-sm",
									children: "Direct Email"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs font-bold",
									children: "support@mahakama.com"
								})] })]
							})
						]
					})
				}), /* @__PURE__ */ jsx(CardWithLabel, {
					label: "Response Time",
					className: "bg-zinc-50",
					children: /* @__PURE__ */ jsx("p", {
						className: "text-sm italic",
						children: "\"We aim to respond to all inquiries within 24 hours during standard East Africa Time (EAT) business hours.\""
					})
				})]
			})]
		})]
	});
};
//#endregion
//#region app/routes/www/contact.tsx
var contact_exports = /* @__PURE__ */ __exportAll({
	default: () => contact_default,
	meta: () => meta$19
});
function meta$19({}) {
	return [{ title: "Contact Us - Mahakama" }, {
		name: "description",
		content: "Get in touch with Mahakama. We're here to help with any questions about our legal services and resources."
	}];
}
var contact_default = UNSAFE_withComponentProps(ContactScreen);
//#endregion
//#region app/components/ui/toggle.tsx
var toggleVariants = cva("inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap", {
	variants: {
		variant: {
			default: "bg-transparent",
			outline: "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground"
		},
		size: {
			default: "h-9 px-2 min-w-9",
			sm: "h-8 px-1.5 min-w-8",
			lg: "h-10 px-2.5 min-w-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Toggle({ className, variant, size, ...props }) {
	return /* @__PURE__ */ jsx(TogglePrimitive.Root, {
		"data-slot": "toggle",
		className: cn(toggleVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
//#endregion
//#region app/components/bookmark-button.tsx
function BookmarkButton({ onClick, isBookmarked = false, bookmarkCount, className = "", size = "md" }) {
	return /* @__PURE__ */ jsxs(Toggle, {
		onClick,
		"aria-label": isBookmarked ? "Bookmarked" : "Bookmark document",
		size: "lg",
		variant: "outline",
		className: "data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500 rounded-full",
		children: [/* @__PURE__ */ jsx(Bookmark, {}), bookmarkCount !== void 0 && /* @__PURE__ */ jsx("span", {
			className: "text-xs ml-1 text-gray-500",
			children: bookmarkCount
		})]
	});
}
//#endregion
//#region app/components/share-button.tsx
function ShareButton({ onClick, isShared = false, shareCount, className = "", size = "md" }) {
	return /* @__PURE__ */ jsxs(Toggle, {
		onClick,
		"aria-label": isShared ? "Shared" : "Share document",
		size: "lg",
		variant: "default",
		className: "data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-green-500 data-[state=on]:*:[svg]:stroke-green-500 rounded-full",
		children: [/* @__PURE__ */ jsx(Share, {}), shareCount !== void 0 && /* @__PURE__ */ jsx("span", {
			className: "text-xs ml-1 text-gray-500",
			children: shareCount
		})]
	});
}
//#endregion
//#region app/components/mah-card.tsx
var MahCard = forwardRef(({ children, variant = "default", className = "", ...props }, ref) => {
	const baseClasses = cn("relative z-10 h-full flex flex-col", className);
	const innerClasses = cn(variant === "default" ? "bg-white rounded-xl p-4" : variant === "minimal" ? "border border-gray-200 bg-white rounded-xl p-4 hover:shadow-md transition-shadow" : "border-2 border-gray-900 bg-white rounded-xl overflow-hidden p-6");
	const outerClasses = cn("border border-gray-300 rounded-xl p-1");
	return /* @__PURE__ */ jsx("div", {
		ref,
		className: baseClasses,
		...props,
		children: /* @__PURE__ */ jsx("div", {
			className: outerClasses,
			style: { backgroundColor: "white" },
			children: /* @__PURE__ */ jsx("div", {
				className: innerClasses,
				style: {
					backgroundColor: "white",
					borderWidth: variant === "default" ? "1px" : void 0,
					borderStyle: variant === "default" ? "solid" : void 0
				},
				children
			})
		})
	});
});
MahCard.displayName = "MahCard";
//#endregion
//#region app/feature/www/components/legal-hub/service-card.tsx
var categoryIcons = {
	government: Building2,
	"legal-aid": Scale,
	"dispute-resolution": HeartHandshake,
	specialized: Shield
};
var categoryLabels = {
	government: "Government",
	"legal-aid": "Legal Aid",
	"dispute-resolution": "Dispute Resolution",
	specialized: "Specialized"
};
function ServiceCard({ service, variant = "default", displayMode = "list" }) {
	categoryIcons[service.category];
	categoryLabels[service.category];
	const handleBookmark = (e) => {
		e.preventDefault();
		console.log("Bookmarking service:", service.name);
	};
	const handleShare = (e) => {
		e.preventDefault();
		console.log("Sharing service:", service.name);
	};
	function getColor(arg0) {
		const colors = [
			"text-blue-900",
			"text-green-900",
			"text-purple-900",
			"text-amber-900",
			"text-rose-900",
			"text-emerald-900",
			"text-indigo-900",
			"text-cyan-900",
			"text-fuchsia-900",
			"text-lime-900"
		];
		return colors[arg0 % colors.length];
	}
	return /* @__PURE__ */ jsxs(MahCard, {
		variant: displayMode === "grid" ? "default" : "minimal",
		className: displayMode === "grid" ? "group" : "",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-start mb-4",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex justify-start",
					children: /* @__PURE__ */ jsx(IconContainer, {
						icon: Building,
						size: "lg",
						color: "outline",
						className: "flex-shrink-0"
					})
				}), /* @__PURE__ */ jsx(ShareButton, {
					onClick: handleShare,
					className: "p-2 text-sm font-medium border-2 border-black rounded-full bg-white shadow-[3px_3px_0_0_#000]",
					"aria-label": "Share service"
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex items-start justify-between mb-4 gap-3",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-xl",
						children: service.name
					}), service.location && /* @__PURE__ */ jsxs("div", {
						className: "flex items-center text-sm text-gray-600 mt-1",
						children: [/* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 mr-1.5 flex-shrink-0" }), /* @__PURE__ */ jsx("span", {
							className: "truncate",
							children: service.location
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-gray-600 mb-4 line-clamp-2",
				children: service.description
			}),
			service.services.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "mt-2 mb-4 flex flex-wrap gap-2",
				children: [service.services.slice(0, 3).map((s, i) => /* @__PURE__ */ jsx("span", {
					className: cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getColor(service.services.length - 3)),
					style: {
						boxShadow: "2px 2px 0 0 #000",
						borderRadius: "4px 8px 4px 8px"
					},
					children: s
				}, i)), service.services.length > 3 && /* @__PURE__ */ jsxs("span", {
					className: cn("text-left py-1.5 sm:py-1 px-3 border-2 border-gray-900 bg-white", "transition-all hover:shadow-md font-medium text-xs sm:text-sm flex items-center gap-2", "active:translate-y-0.5 active:shadow-none hover:bg-gray-50", getColor(service.services.length - 3)),
					children: [
						"+",
						service.services.length - 3,
						" more"
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-auto pt-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsxs(MahButton, {
						href: `/legal-hub/${service.id}`,
						variant: "card",
						className: "flex-[2]",
						children: ["View details", /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 ml-1" })]
					}), /* @__PURE__ */ jsx(BookmarkButton, {
						onClick: handleBookmark,
						className: "p-2 text-sm font-medium border-2 border-black rounded-full bg-white shadow-[3px_3px_0_0_#000] flex-[1] h-full",
						"aria-label": "Bookmark service"
					})]
				})
			})
		]
	});
}
//#endregion
//#region app/components/search-bar.tsx
var searchSchema = z.object({ query: z.string().min(0).max(100, "Search query must be less than 100 characters") });
function SearchBar({ value, onChange, placeholder = "Search...", disabled = false, className = "" }) {
	const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
		resolver: zodResolver(searchSchema),
		defaultValues: { query: value }
	});
	const query = watch("query");
	React.useEffect(() => {
		if (query !== value) onChange(query);
	}, [query, onChange]);
	React.useEffect(() => {
		setValue("query", value);
	}, [value, setValue]);
	return /* @__PURE__ */ jsxs("div", {
		className: "relative flex-1",
		children: [
			/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" }),
			/* @__PURE__ */ jsx("form", {
				onSubmit: handleSubmit(() => {}),
				children: /* @__PURE__ */ jsx(Input, {
					...register("query"),
					type: "text",
					placeholder,
					disabled,
					className: `pl-10 pr-4 border-2 border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-[2px_2px_0_0_hsl(var(--shadow-color))] ${className}`,
					"aria-invalid": !!errors.query
				})
			}),
			errors.query && /* @__PURE__ */ jsx("p", {
				className: "text-red-500 text-xs mt-1 absolute -bottom-5 left-0",
				children: errors.query.message
			})
		]
	});
}
//#endregion
//#region app/components/ui/select.tsx
function Select({ ...props }) {
	return /* @__PURE__ */ jsx(SelectPrimitive.Root, {
		"data-slot": "select",
		...props
	});
}
function SelectValue({ ...props }) {
	return /* @__PURE__ */ jsx(SelectPrimitive.Value, {
		"data-slot": "select-value",
		...props
	});
}
function SelectTrigger({ className, size = "default", children, ...props }) {
	return /* @__PURE__ */ jsxs(SelectPrimitive.Trigger, {
		"data-slot": "select-trigger",
		"data-size": size,
		className: cn("border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(SelectPrimitive.Icon, {
			asChild: true,
			children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4 opacity-50" })
		})]
	});
}
function SelectContent({ className, children, position = "popper", align = "center", ...props }) {
	return /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(SelectPrimitive.Content, {
		"data-slot": "select-content",
		className: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
		position,
		align,
		...props,
		children: [
			/* @__PURE__ */ jsx(SelectScrollUpButton, {}),
			/* @__PURE__ */ jsx(SelectPrimitive.Viewport, {
				className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"),
				children
			}),
			/* @__PURE__ */ jsx(SelectScrollDownButton, {})
		]
	}) });
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ jsxs(SelectPrimitive.Item, {
		"data-slot": "select-item",
		className: cn("focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className),
		...props,
		children: [/* @__PURE__ */ jsx("span", {
			className: "absolute right-2 flex size-3.5 items-center justify-center",
			children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-4" }) })
		}), /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })]
	});
}
function SelectScrollUpButton({ className, ...props }) {
	return /* @__PURE__ */ jsx(SelectPrimitive.ScrollUpButton, {
		"data-slot": "select-scroll-up-button",
		className: cn("flex cursor-default items-center justify-center py-1", className),
		...props,
		children: /* @__PURE__ */ jsx(ChevronUpIcon, { className: "size-4" })
	});
}
function SelectScrollDownButton({ className, ...props }) {
	return /* @__PURE__ */ jsx(SelectPrimitive.ScrollDownButton, {
		"data-slot": "select-scroll-down-button",
		className: cn("flex cursor-default items-center justify-center py-1", className),
		...props,
		children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4" })
	});
}
//#endregion
//#region app/components/sort-select.tsx
function SortSelect({ value, onValueChange, options, disabled = false }) {
	return /* @__PURE__ */ jsx("div", {
		className: "w-[180px] border-2 border-gray-900 bg-white hover:bg-yellow-50",
		style: { borderRadius: "4px 8px 4px 8px" },
		children: /* @__PURE__ */ jsxs(Select, {
			value,
			onValueChange,
			disabled,
			children: [/* @__PURE__ */ jsx(SelectTrigger, {
				className: "w-full border-none bg-transparent shadow-none",
				children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Sort by" })
			}), /* @__PURE__ */ jsx(SelectContent, {
				className: "border-2 border-gray-900 bg-white",
				children: options.map((option) => /* @__PURE__ */ jsx(SelectItem, {
					value: option.value,
					children: option.label
				}, option.value))
			})]
		})
	});
}
//#endregion
//#region app/components/ui/button-group.tsx
var buttonGroupVariants = cva("flex w-fit items-stretch [&>*]:focus-visible:z-10 [&>*]:focus-visible:relative [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md has-[>[data-slot=button-group]]:gap-2", {
	variants: { orientation: {
		horizontal: "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
		vertical: "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none"
	} },
	defaultVariants: { orientation: "horizontal" }
});
function ButtonGroup({ className, orientation, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		role: "group",
		"data-slot": "button-group",
		"data-orientation": orientation,
		className: cn(buttonGroupVariants({ orientation }), className),
		...props
	});
}
//#endregion
//#region app/components/view-mode-toggle.tsx
function ViewModeToggle({ currentMode, onModeChange, disabled = false, className = "" }) {
	return /* @__PURE__ */ jsxs(ButtonGroup, { children: [/* @__PURE__ */ jsx(Button, {
		variant: currentMode === "grid" ? "default" : "outline",
		size: "icon",
		className: `border-2 border-gray-900 ${currentMode === "grid" ? "bg-gray-900 text-white" : "bg-white hover:bg-yellow-50"}`,
		style: {
			boxShadow: "2px 2px 0 0 #000",
			borderRadius: "4px 0 0 4px"
		},
		onClick: () => onModeChange("grid"),
		disabled,
		children: /* @__PURE__ */ jsx(LayoutGrid, { className: "h-4 w-4" })
	}), /* @__PURE__ */ jsx(Button, {
		variant: currentMode === "list" ? "default" : "outline",
		size: "icon",
		className: `border-2 border-l-0 border-gray-900 ${currentMode === "list" ? "bg-gray-900 text-white" : "bg-white hover:bg-yellow-50"}`,
		style: {
			boxShadow: "2px 2px 0 0 #000",
			borderRadius: "0 4px 4px 0"
		},
		onClick: () => onModeChange("list"),
		disabled,
		children: /* @__PURE__ */ jsx(List, { className: "h-4 w-4" })
	})] });
}
//#endregion
//#region app/components/filter-select.tsx
function FilterSelect({ value, onValueChange, options, disabled = false }) {
	return /* @__PURE__ */ jsx("div", {
		className: "w-[180px] border-2 border-gray-900 bg-white hover:bg-yellow-50",
		style: { borderRadius: "4px 8px 4px 8px" },
		children: /* @__PURE__ */ jsxs(Select, {
			value,
			onValueChange,
			disabled,
			children: [/* @__PURE__ */ jsx(SelectTrigger, {
				className: "w-full border-none bg-transparent shadow-none",
				children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Filter by" })
			}), /* @__PURE__ */ jsx(SelectContent, {
				className: "border-2 border-gray-900 bg-white",
				children: options.map((option) => {
					const Icon = option.icon;
					return /* @__PURE__ */ jsx(SelectItem, {
						value: option.value,
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [Icon && /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }), option.label]
						})
					}, option.value);
				})
			})]
		})
	});
}
//#endregion
//#region app/components/list-controls.tsx
var DEFAULT_SORT_OPTIONS = [
	{
		value: "createdAt",
		label: "Most Recent"
	},
	{
		value: "name",
		label: "Name (A-Z)"
	},
	{
		value: "-name",
		label: "Name (Z-A)"
	}
];
function ListControls({ totalItems, onViewModeChange, onDisplayModeChange, displayMode: externalDisplayMode = "list", label = "Section", itemName = "item", className = "", onSearch, searchPlaceholder = "Search...", searchValue = "", sortBy = "createdAt", sortOrder = "desc", sortOptions = DEFAULT_SORT_OPTIONS, onSortChange, filterBy, filterOptions = [], onFilterChange, isLoading = false }) {
	const [viewMode, setViewMode] = useState(externalDisplayMode);
	const [localSortBy, setLocalSortBy] = useState(sortBy);
	const [localSortOrder, setLocalSortOrder] = useState(sortOrder);
	const [localFilterBy, setLocalFilterBy] = useState(filterBy || "");
	const [searchQuery, setSearchQuery] = useState(searchValue || "");
	useEffect(() => {
		if (externalDisplayMode !== viewMode) setViewMode(externalDisplayMode);
	}, [externalDisplayMode, viewMode]);
	useEffect(() => {
		if (searchValue !== searchQuery) setSearchQuery(searchValue);
	}, [searchValue, setSearchQuery]);
	const handleSortChange = (value) => {
		const newSortBy = value.startsWith("-") ? value.substring(1) : value;
		const newSortOrder = value.startsWith("-") ? "desc" : "asc";
		setLocalSortBy(newSortBy);
		setLocalSortOrder(newSortOrder);
		onSortChange?.(newSortBy, newSortOrder);
	};
	const handleFilterChange = (value) => {
		setLocalFilterBy(value);
		onFilterChange?.(value);
	};
	const handleSearchChange = (value) => {
		setSearchQuery(value);
		onSearch?.(value);
	};
	const currentSortValue = `${localSortOrder === "desc" && localSortBy !== "createdAt" ? "-" : ""}${localSortBy}`;
	const dynamicLabel = label && totalItems !== void 0 ? `${totalItems} ${label}` : label;
	return /* @__PURE__ */ jsx("div", {
		className: `space-y-4 w-full ${className}`,
		children: /* @__PURE__ */ jsx(CardWithLabel, {
			label: dynamicLabel,
			className: "px-4 py-3 border-solid border-gray-150 rounded-[8px_16px_8px_16px] max-w-none mx-0",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-2 w-full sm:w-96",
					children: /* @__PURE__ */ jsx(SearchBar, {
						value: searchQuery,
						onChange: handleSearchChange,
						placeholder: searchPlaceholder
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "flex flex-col sm:flex-row gap-2 w-full sm:w-auto",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [
							filterOptions.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-sm text-gray-500 hidden sm:inline",
									children: "Filter by:"
								}), /* @__PURE__ */ jsx(FilterSelect, {
									value: localFilterBy,
									onValueChange: handleFilterChange,
									options: filterOptions,
									disabled: isLoading
								})]
							}), /* @__PURE__ */ jsx("div", { className: "h-6 w-px bg-gray-300 mx-2" })] }),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-sm text-gray-500 hidden sm:inline",
									children: "Sort by:"
								}), /* @__PURE__ */ jsx(SortSelect, {
									value: currentSortValue,
									onValueChange: handleSortChange,
									options: sortOptions,
									disabled: isLoading
								})]
							}),
							/* @__PURE__ */ jsx("div", { className: "h-6 w-px bg-gray-300 mx-2" }),
							/* @__PURE__ */ jsx(ViewModeToggle, {
								currentMode: viewMode,
								onModeChange: (newMode) => {
									setViewMode(newMode);
									onViewModeChange?.(newMode);
									onDisplayModeChange?.(newMode);
								},
								disabled: isLoading
							})
						]
					})
				})]
			})
		})
	});
}
//#endregion
//#region app/components/ui/empty.tsx
function Empty({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "empty",
		className: cn("flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12", className),
		...props
	});
}
function EmptyHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "empty-header",
		className: cn("flex max-w-sm flex-col items-center gap-2 text-center", className),
		...props
	});
}
var emptyMediaVariants = cva("mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0", {
	variants: { variant: {
		default: "bg-transparent",
		icon: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-6"
	} },
	defaultVariants: { variant: "default" }
});
function EmptyMedia({ className, variant = "default", ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "empty-icon",
		"data-variant": variant,
		className: cn(emptyMediaVariants({
			variant,
			className
		})),
		...props
	});
}
function EmptyTitle({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "empty-title",
		className: cn("text-lg font-medium tracking-tight", className),
		...props
	});
}
function EmptyDescription({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "empty-description",
		className: cn("text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary", className),
		...props
	});
}
function EmptyContent({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "empty-content",
		className: cn("flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance", className),
		...props
	});
}
//#endregion
//#region app/components/async-state/EmptyState.tsx
function EmptyState({ label = "Empty State", title = "No Results Found", description = "No items match your search criteria. Try adjusting your filters or search term.", className = "", actions = [], showDefaultActions = true }) {
	const displayActions = showDefaultActions ? [...[{
		label: "Go to Home",
		href: "/",
		variant: "outline",
		icon: /* @__PURE__ */ jsx(Home, { className: "h-4 w-4 mr-2" })
	}, {
		label: "Ask a Question",
		href: "/ask",
		variant: "default",
		icon: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" })
	}], ...actions] : actions;
	return /* @__PURE__ */ jsx(CardWithLabel, {
		label,
		className,
		children: /* @__PURE__ */ jsxs(Empty, { children: [/* @__PURE__ */ jsxs(EmptyHeader, { children: [
			/* @__PURE__ */ jsx(EmptyMedia, {
				variant: "icon",
				children: /* @__PURE__ */ jsx(FileSearch, { className: "h-5 w-5 text-gray-400" })
			}),
			/* @__PURE__ */ jsx(EmptyTitle, { children: title }),
			/* @__PURE__ */ jsx(EmptyDescription, { children: typeof description === "string" ? /* @__PURE__ */ jsx("p", { children: description }) : description })
		] }), displayActions.length > 0 && /* @__PURE__ */ jsx(EmptyContent, { children: /* @__PURE__ */ jsx("div", {
			className: "flex flex-wrap gap-4",
			children: displayActions.map((action, index) => {
				const isPrimary = action.variant === "default" || !action.variant;
				const buttonClass = isPrimary ? "bg-yellow-400 hover:bg-yellow-300 text-gray-900 border-gray-900 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-white hover:bg-gray-50 text-gray-900 border-gray-900";
				return /* @__PURE__ */ jsx(Button, {
					asChild: !!action.href,
					className: `relative px-6 py-3 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${buttonClass}`,
					style: {
						borderRadius: "8px 16px 8px 16px",
						boxShadow: "3px 3px 0 0 #000"
					},
					onClick: action.onClick,
					children: action.href ? /* @__PURE__ */ jsxs("a", {
						href: action.href,
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [action.icon, action.label]
						}), isPrimary && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { className: "absolute -right-1 -top-1 w-3 h-3 border-t-2 border-r-2 border-gray-900" }), /* @__PURE__ */ jsx("span", { className: "absolute -left-1 -bottom-1 w-3 h-3 border-b-2 border-l-2 border-gray-900" })] })]
					}) : /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [action.icon, action.label]
					})
				}, index);
			})
		}) })] })
	});
}
//#endregion
//#region app/components/async-state/LoadingState.tsx
function LoadingState({ label = "Loading", title = "Loading Content", description = "Please wait while we load your content...", className = "" }) {
	return /* @__PURE__ */ jsx(CardWithLabel, {
		label,
		className: `bg-white ${className}`,
		labelClassName: "text-blue-600",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-start gap-4",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex-shrink-0 mt-1",
				children: /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 text-blue-600 animate-spin" })
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex-1",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-lg font-medium text-gray-900 mb-2",
					children: title
				}), /* @__PURE__ */ jsx("div", {
					className: "text-gray-700 text-sm mb-6",
					children: typeof description === "string" ? /* @__PURE__ */ jsx("p", { children: description }) : description
				})]
			})]
		})
	});
}
//#endregion
//#region app/feature/www/components/legal-hub/services-list.tsx
function ServicesList({ services = [], displayMode: externalDisplayMode = "grid", variant = "default", showControls = true, isLoading = false, onDisplayModeChange }) {
	const [displayMode, setDisplayMode] = useState(externalDisplayMode);
	const currentDisplayMode = externalDisplayMode || displayMode;
	const handleDisplayModeChange = onDisplayModeChange || setDisplayMode;
	useEffect(() => {
		setDisplayMode(externalDisplayMode);
	}, [externalDisplayMode]);
	if (isLoading) return /* @__PURE__ */ jsx(LoadingState, {
		label: "Loading Services",
		title: "Loading Legal Services",
		description: "Please wait while we load the available legal services...",
		className: "mt-8"
	});
	if (services.length === 0) return /* @__PURE__ */ jsx(EmptyState, {
		label: "No Services",
		title: "No Legal Services Found",
		description: "No legal services match your search criteria. Try adjusting your filters or search for different services.",
		className: "mt-8",
		actions: [{
			label: "Browse All Categories",
			href: "/legal-hub",
			variant: "outline"
		}],
		showDefaultActions: true
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [showControls && /* @__PURE__ */ jsx(ListControls, {
			totalItems: services.length,
			itemName: "service",
			displayMode: currentDisplayMode,
			onDisplayModeChange: handleDisplayModeChange
		}), currentDisplayMode === "grid" ? /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
			children: services.map((service) => /* @__PURE__ */ jsx("div", {
				className: "h-full",
				children: /* @__PURE__ */ jsx(ServiceCard, {
					service,
					variant,
					displayMode: "grid"
				})
			}, service.id))
		}) : /* @__PURE__ */ jsx("div", {
			className: "space-y-4",
			children: services.map((service) => /* @__PURE__ */ jsx(ServiceCard, {
				service,
				variant,
				displayMode: currentDisplayMode
			}, service.id))
		})]
	});
}
//#endregion
//#region app/feature/www/screens/LegalHubScreen.tsx
var LegalHubScreen = ({ services, isAuthenticated, displayMode = "grid", onDisplayModeChange }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [locationFilter, setLocationFilter] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
	return /* @__PURE__ */ jsxs(Fragment, { children: [!isAuthenticated && /* @__PURE__ */ jsxs("div", {
		className: "bg-background",
		children: [/* @__PURE__ */ jsx(HeroSection, {
			title: "Legal Services Directory",
			description: "Connect with government offices, legal aid providers, and dispute resolution services in South Sudan and Uganda.",
			actionVariant: "search",
			onSearch: (query) => setSearchTerm(query),
			searchPlaceholder: "Search for services, institutions, or locations...",
			icon: Building2
		}), /* @__PURE__ */ jsx(DiagonalSeparator, {})]
	}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
		className: "md:hidden",
		children: /* @__PURE__ */ jsxs(Button, {
			variant: "outline",
			className: "w-full flex items-center justify-between",
			onClick: () => setIsMobileFiltersOpen(!isMobileFiltersOpen),
			children: [/* @__PURE__ */ jsxs("span", { children: ["Filters ", (searchTerm !== "" || selectedCategory !== "all" || locationFilter !== "") && `(${services?.length} results)`] }), /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" })]
		})
	}), /* @__PURE__ */ jsx(ServicesList, {
		services,
		variant: "default",
		showControls: true,
		isLoading: false,
		displayMode,
		onDisplayModeChange
	})] })] });
};
//#endregion
//#region app/lib/api/services.api.ts
var ServicesApiClient = class {
	api;
	constructor(apiClient) {
		this.api = apiClient || new FetchApiClient();
	}
	async getServices(category) {
		try {
			let url = "/v1/services";
			if (category) url += `?category=${encodeURIComponent(category)}`;
			const response = await this.api.request(url);
			if (!response.data) {
				console.error("Invalid services data:", response);
				throw new Error("Invalid services data received from the server");
			}
			return response.data.map((resource) => resource.attributes);
		} catch (error) {
			console.error("Failed to fetch services:", error);
			throw error;
		}
	}
	async getServiceById(serviceId) {
		try {
			const response = await this.api.request(`/v1/services/${serviceId}`);
			if (!response.data.attributes) {
				console.error("Invalid service data:", response);
				throw new Error("Invalid service data received from the server");
			}
			return response.data.attributes;
		} catch (error) {
			console.error("Failed to fetch service:", error);
			throw error;
		}
	}
};
var servicesApi = new ServicesApiClient();
//#endregion
//#region app/feature/www/hooks/use-services.ts
var servicesKeys = {
	all: ["services"],
	services: () => [...servicesKeys.all, "services"],
	service: (id) => [
		...servicesKeys.all,
		"service",
		id
	],
	servicesByCategory: (category) => [
		...servicesKeys.all,
		"services",
		"category",
		category
	]
};
function useServices(category) {
	return useQuery({
		queryKey: category ? servicesKeys.servicesByCategory(category) : servicesKeys.services(),
		queryFn: async () => {
			return await servicesApi.getServices(category);
		},
		meta: {
			errorToast: true,
			errorMessage: "Failed to load services"
		}
	});
}
function useService(id) {
	return useQuery({
		queryKey: servicesKeys.service(id),
		queryFn: async () => {
			return await servicesApi.getServiceById(id);
		},
		enabled: !!id,
		meta: {
			errorToast: true,
			errorMessage: "Failed to load service"
		}
	});
}
//#endregion
//#region app/routes/www/legal-hub.tsx
var legal_hub_exports = /* @__PURE__ */ __exportAll({
	default: () => legal_hub_default,
	loader: () => loader$9,
	meta: () => meta$18
});
function meta$18({}) {
	return [
		{ title: "Legal Services Directory - Mahakama" },
		{
			name: "description",
			content: "Find legal services, government offices, and legal aid providers in South Sudan and Uganda."
		},
		{
			name: "keywords",
			content: "legal aid South Sudan, government offices, dispute resolution, legal services, legal assistance, Uganda legal help, free legal aid, court services, mediation centers"
		},
		{
			name: "og:title",
			content: "Find Legal Services & Institutions - Mahakama"
		},
		{
			name: "og:description",
			content: "Access a comprehensive directory of legal institutions and service providers in South Sudan and Uganda. Connect with the right legal resources for your needs."
		},
		{
			name: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:title",
			content: "Legal Institutions Directory - Mahakama"
		},
		{
			name: "twitter:description",
			content: "Find government offices, legal aid providers, and dispute resolution services in South Sudan and Uganda."
		}
	];
}
async function loader$9({ context }) {
	try {
		return {
			user: context.get(userContext),
			token: context.get(authContext)?.token || null,
			error: null
		};
	} catch (error) {
		return {
			user: null,
			token: null,
			error: error instanceof Error ? error.message : "Failed to load services"
		};
	}
}
var legal_hub_default = UNSAFE_withComponentProps(function LegalHubPage({ loaderData }) {
	const { user, error } = loaderData;
	if (error) return /* @__PURE__ */ jsx(ErrorState$1, { error });
	const { data: services, isLoading, error: servicesError } = useServices(void 0);
	const [displayMode, setDisplayMode] = useState("grid");
	if (isLoading) return /* @__PURE__ */ jsx(LoadingState, {});
	const errorMessage = servicesError ? servicesError instanceof Error ? servicesError.message : "Failed to load services" : error || "Failed to load services";
	if (servicesError || error) return /* @__PURE__ */ jsx(ErrorState$1, { error: errorMessage });
	return /* @__PURE__ */ jsx(LegalHubScreen, {
		services: services ?? [],
		isAuthenticated: !!user,
		displayMode,
		onDisplayModeChange: setDisplayMode
	});
});
//#endregion
//#region app/layouts/PageHeader.tsx
function PageHeader({ showBackButton = true, className = "", breadcrumbs, children, backTo }) {
	const navigate = useNavigate();
	const location = useLocation();
	const pathSegments = breadcrumbs || location.pathname.split("/").filter(Boolean).map((segment, index) => ({
		label: segment.replace(/-/g, " "),
		to: void 0,
		icon: index === 0 ? Home : void 0
	}));
	return /* @__PURE__ */ jsxs("div", {
		className: `flex items-center justify-between ${className}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center space-x-2",
			children: [showBackButton && (backTo ? /* @__PURE__ */ jsx(NavLink, {
				to: backTo,
				viewTransition: true,
				className: "p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors",
				"aria-label": "Go back",
				children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" })
			}) : /* @__PURE__ */ jsx("button", {
				onClick: () => navigate(-1),
				className: "p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors",
				"aria-label": "Go back",
				children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" })
			})), /* @__PURE__ */ jsx("nav", {
				className: "flex items-center text-sm",
				children: pathSegments.map((segment, index) => /* @__PURE__ */ jsxs("div", {
					className: "flex items-center",
					children: [index > 0 && /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5 mx-2 text-muted-foreground/60" }), segment.to ? /* @__PURE__ */ jsxs(Link, {
						to: segment.to,
						viewTransition: true,
						className: "text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent/50 flex items-center gap-1",
						children: [segment.icon && /* @__PURE__ */ jsx(segment.icon, { className: "w-3.5 h-3.5" }), segment.label]
					}) : /* @__PURE__ */ jsxs("span", {
						className: "font-medium text-foreground px-2 py-1 flex items-center gap-1",
						children: [segment.icon && /* @__PURE__ */ jsx(segment.icon, { className: "w-3.5 h-3.5" }), segment.label]
					})]
				}, index))
			})]
		}), children && /* @__PURE__ */ jsx("div", {
			className: "flex items-center space-x-2",
			children
		})]
	});
}
//#endregion
//#region app/components/ui/badge.tsx
var badgeVariants = cva("inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
		secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
		destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
		outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, asChild = false, ...props }) {
	return /* @__PURE__ */ jsx(asChild ? Slot : "span", {
		"data-slot": "badge",
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
//#region app/layouts/page-detail-header.tsx
function PageDetailHeader({ type, title, description, icon, image, alt = "", metadata, actions = [], className = "" }) {
	return /* @__PURE__ */ jsxs(CardWithLabel, {
		label: type,
		labelClassName: "bg-yellow-100 text-yellow-800 font-bold border-2 border-gray-900",
		className: `w-full mx-0 max-w-none space-y-4 ${className} border-solid`,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex-1 flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex-shrink-0",
					children: image ? /* @__PURE__ */ jsx("img", {
						src: image,
						alt,
						className: "w-16 h-16 rounded-full object-cover border-2 border-gray-900",
						style: { boxShadow: "2px 2px 0 0 #000" }
					}) : icon ? /* @__PURE__ */ jsx(IconContainer, {
						icon,
						size: "lg",
						color: "handdrawn"
					}) : null
				}), /* @__PURE__ */ jsx("div", {
					className: "flex-1",
					children: /* @__PURE__ */ jsx("h1", {
						className: "text-3xl font-black text-gray-900",
						children: title
					})
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-gray-600 text-lg",
				children: description
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-6",
				children: metadata.map((item, index) => /* @__PURE__ */ jsxs(Badge, {
					variant: "outline",
					className: "flex items-center gap-1 border-2 border-gray-900 bg-white",
					style: { boxShadow: "2px 2px 0 0 #000" },
					children: [
						/* @__PURE__ */ jsx(item.icon, { className: "h-3 w-3" }),
						item.label,
						": ",
						item.value
					]
				}, index))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-3",
				children: actions.map((action, index) => {
					if (action.href) return /* @__PURE__ */ jsxs("a", {
						href: action.href,
						download: action.download,
						className: `inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-2 border-black rounded-lg text-gray-900 ${action.variant === "primary" ? "bg-yellow-300 shadow-[2px_2px_0_0_#000] translate-x-0 translate-y-0" : "bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:text-gray-900"}`,
						children: [/* @__PURE__ */ jsx(action.icon, { className: "h-4 w-4 mr-2" }), action.label]
					}, index);
					return /* @__PURE__ */ jsxs(MahButton, {
						onClick: action.onClick,
						variant: action.variant === "primary" ? "primary" : "secondary",
						children: [/* @__PURE__ */ jsx(action.icon, { className: "h-4 w-4 mr-2" }), action.label]
					}, index);
				})
			})
		]
	});
}
//#endregion
//#region app/utils/time.ts
var formatDate$1 = (dateString) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
};
//#endregion
//#region app/components/contact-information.tsx
var iconMap$1 = {
	email: Mail,
	phone: Phone,
	location: MapPin,
	date: Calendar,
	website: Globe
};
var iconColorMap$1 = {
	email: "text-blue-600",
	phone: "text-green-600",
	location: "text-red-600",
	date: "text-purple-600",
	website: "text-blue-600"
};
function ContactInformation$1({ title = "Contact Information", description, contactItems, className = "" }) {
	const getIcon = (type, customIcon) => {
		if (customIcon) return customIcon;
		return iconMap$1[type];
	};
	const getIconColor = (type) => {
		return iconColorMap$1[type];
	};
	const renderContent = (item) => {
		if (item.href) return /* @__PURE__ */ jsx("a", {
			href: item.href,
			target: item.type === "website" ? "_blank" : void 0,
			rel: item.type === "website" ? "noopener noreferrer" : void 0,
			className: "text-blue-600 hover:text-blue-800 underline font-semibold",
			children: item.value
		});
		return /* @__PURE__ */ jsx("p", {
			className: "text-base font-semibold",
			children: item.value
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: `space-y-6 ${className}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-2",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "text-lg font-semibold text-gray-900",
				children: title
			}), description && /* @__PURE__ */ jsx("p", {
				className: "text-sm text-gray-500",
				children: description
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "space-y-4",
			children: contactItems.map((item, index) => {
				const Icon = getIcon(item.type, item.icon);
				const iconColor = getIconColor(item.type);
				return /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3 bg-white px-4 py-3 rounded-lg border-2 border-gray-900",
					style: { boxShadow: "2px 2px 0 0 #000" },
					children: [/* @__PURE__ */ jsx(Icon, { className: `w-5 h-5 ${iconColor}` }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-sm font-medium text-gray-500",
						children: item.label
					}), renderContent(item)] })]
				}, index);
			})
		})]
	});
}
//#endregion
//#region app/feature/www/screens/ServiceDetailScreen.tsx
function ServiceDetailScreen({ service, onBack }) {
	const contactItems = [];
	if (service.contact) contactItems.push({
		type: "phone",
		label: "Phone",
		value: service.contact
	});
	if (service.location) contactItems.push({
		type: "location",
		label: "Location",
		value: service.location
	});
	if (service.website) contactItems.push({
		type: "website",
		label: "Website",
		value: "Visit Website",
		href: service.website
	});
	const metadata = [];
	if (service.category) metadata.push({
		icon: Building,
		label: "Category",
		value: service.category
	});
	const actions = [];
	if (onBack) actions.push({
		label: "Back",
		icon: ArrowLeft,
		onClick: onBack,
		variant: "outline"
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				showBackButton: !!onBack,
				breadcrumbs: [
					{
						label: "Home",
						to: "/",
						icon: Home
					},
					{
						label: "Services",
						to: "/services",
						icon: Building
					},
					{ label: service.name }
				]
			}),
			/* @__PURE__ */ jsx(PageDetailHeader, {
				type: "Service Detail",
				title: service.name,
				description: service.description,
				icon: Building,
				metadata
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "lg:col-span-2 space-y-8",
					children: [service.services && Array.isArray(service.services) && service.services.length > 0 && /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-lg shadow p-6",
						children: [/* @__PURE__ */ jsxs("h2", {
							className: "text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }), "Services Offered"]
						}), /* @__PURE__ */ jsx("ul", {
							className: "space-y-2",
							children: service.services.map((serviceItem, index) => /* @__PURE__ */ jsxs("li", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" }), /* @__PURE__ */ jsx("span", {
									className: "text-gray-700",
									children: typeof serviceItem === "string" ? serviceItem : typeof serviceItem === "object" && serviceItem !== null ? JSON.stringify(serviceItem) : String(serviceItem)
								})]
							}, index))
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-lg shadow p-6",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-semibold text-gray-900 mb-4",
							children: "Additional Information"
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx(Clock, { className: "h-5 w-5 text-gray-400" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "font-medium text-gray-900",
									children: "Service Availability"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-gray-600",
									children: "Contact for operating hours"
								})] })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx(Users, { className: "h-5 w-5 text-gray-400" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "font-medium text-gray-900",
									children: "Service Type"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-gray-600 capitalize",
									children: service.category?.replace("-", " ") || "General Legal Service"
								})] })]
							})]
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [contactItems.length > 0 && /* @__PURE__ */ jsx(ContactInformation$1, {
						title: "Contact Information",
						description: "Get in touch with this service provider.",
						contactItems
					}), /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-lg shadow p-6",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-semibold text-gray-900 mb-4",
							children: "Get Help"
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ jsx(Button, {
									className: "w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 border-gray-900",
									children: "Contact Service Provider"
								}),
								/* @__PURE__ */ jsx(Button, {
									variant: "outline",
									className: "w-full",
									children: "Ask a Legal Question"
								}),
								/* @__PURE__ */ jsx(Button, {
									variant: "outline",
									className: "w-full",
									children: "Find Similar Services"
								})
							]
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
//#region app/components/page-details-loading.tsx
function PageDetailsLoading({ title = "Loading Details", description = "Please wait while we load the details...", showSkeleton = true, skeletonCount = 3, className = "" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `space-y-6 ${className}`,
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "animate-pulse",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4 mb-6",
					children: [/* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gray-200 rounded-full" }), /* @__PURE__ */ jsxs("div", {
						className: "flex-1 space-y-2",
						children: [/* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-200 rounded w-3/4" }), /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-1/2" })]
					})]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "animate-pulse",
				children: /* @__PURE__ */ jsx("div", {
					className: "bg-white border-2 border-gray-900 rounded-lg p-6",
					style: { borderRadius: "8px 16px 8px 16px" },
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-start gap-6",
						children: [/* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-gray-200 rounded-full border-2 border-gray-300 flex-shrink-0" }), /* @__PURE__ */ jsxs("div", {
							className: "flex-1 space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ jsx("div", { className: "h-8 bg-gray-200 rounded w-3/4" }), /* @__PURE__ */ jsx("div", { className: "h-5 bg-gray-200 rounded w-1/2" })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap gap-4",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("div", { className: "w-4 h-4 bg-gray-200 rounded" }), /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-20" })]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("div", { className: "w-4 h-4 bg-gray-200 rounded" }), /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-24" })]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("div", { className: "w-4 h-4 bg-gray-200 rounded" }), /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-16" })]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex gap-3 pt-2",
									children: [/* @__PURE__ */ jsx("div", { className: "h-10 bg-gray-200 rounded w-32" }), /* @__PURE__ */ jsx("div", { className: "h-10 bg-gray-200 rounded w-28" })]
								})
							]
						})]
					})
				})
			}),
			showSkeleton && /* @__PURE__ */ jsx("div", {
				className: "space-y-6",
				children: Array.from({ length: skeletonCount }).map((_, index) => /* @__PURE__ */ jsx("div", {
					className: "animate-pulse",
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white border-2 border-gray-900 rounded-lg p-6",
						style: { borderRadius: "8px 16px 8px 16px" },
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-3 mb-4",
								children: [/* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-200 rounded w-1/3" }), /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-2/3" })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded" }),
									/* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-5/6" }),
									/* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-4/5" }),
									/* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4" })
								]
							}),
							index % 2 === 0 && /* @__PURE__ */ jsxs("div", {
								className: "mt-4 space-y-2",
								children: [
									/* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-1/4" }),
									/* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-1/3" }),
									/* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-1/5" })
								]
							}),
							index % 3 === 0 && /* @__PURE__ */ jsxs("div", {
								className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ jsx("div", { className: "h-16 bg-gray-200 rounded" }), /* @__PURE__ */ jsx("div", { className: "h-16 bg-gray-200 rounded" })]
							})
						]
					})
				}, index))
			})
		]
	});
}
//#endregion
//#region app/components/page-details-error.tsx
function PageDetailsError({ error, title = "Error Loading Details", description = "We couldn't load the details you requested. Please try again.", onRetry, className = "" }) {
	const errorMessage = error instanceof Error ? error.message : String(error);
	return /* @__PURE__ */ jsx("div", {
		className: `space-y-6 ${className}`,
		children: /* @__PURE__ */ jsx(CardWithLabel, {
			label: "Error",
			className: "bg-white",
			labelClassName: "text-red-600",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-start gap-4",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex-shrink-0 mt-1",
					children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5 text-red-600" })
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex-1",
					children: [
						/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-medium text-gray-900 mb-2",
							children: title
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "text-gray-700 text-sm",
							children: [/* @__PURE__ */ jsx("p", { children: description }), errorMessage && /* @__PURE__ */ jsx("div", {
								className: "mt-2 p-3 bg-red-50 border border-red-200 rounded-lg",
								children: /* @__PURE__ */ jsx("p", {
									className: "text-red-800 text-sm font-medium",
									children: errorMessage
								})
							})]
						}),
						onRetry && /* @__PURE__ */ jsxs("button", {
							onClick: onRetry,
							className: "mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors border-2 border-red-800 shadow-[3px_3px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px]",
							children: [/* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4" }), "Try Again"]
						})
					]
				})]
			})
		})
	});
}
//#endregion
//#region app/routes/www/legal-hub/$serviceId.tsx
var $serviceId_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$16,
	default: () => $serviceId_default,
	loader: () => loader$8,
	meta: () => meta$17
});
function meta$17({ params }) {
	return [{ title: `Legal Service Details - Mahakama` }, {
		name: "description",
		content: "View detailed information about legal services, including contact details, services offered, and location information."
	}];
}
async function loader$8({ context, params }) {
	try {
		const token = context.get(authContext)?.token || null;
		return {
			serviceId: params.serviceId,
			token,
			error: null
		};
	} catch (error) {
		handleRouteError(error, "Failed to load service details");
	}
}
var $serviceId_default = UNSAFE_withComponentProps(function ServiceDetailPage({ loaderData }) {
	const { serviceId, error } = loaderData;
	const { data: service, isLoading, error: serviceError } = useService(serviceId);
	const handleBack = () => {
		window.location.href = "/legal-hub";
	};
	return /* @__PURE__ */ jsx(ServiceDetailScreen, {
		service,
		onBack: handleBack
	});
});
var ErrorBoundary$16 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/lib/api/chat.api.ts
var ChatApiClient = class {
	api;
	constructor() {
		this.api = new FetchApiClient();
	}
	async createChat(payload, options = { headers: {} }) {
		try {
			const response = await this.api.request("/v1/chats", {
				method: "POST",
				headers: options.headers,
				body: JSON.stringify(payload)
			});
			if (!response.data.attributes) {
				console.error("Invalid chat data:", response);
				throw new Error("Invalid chat data received from the server");
			}
			return response.data.attributes;
		} catch (error) {
			console.error("Failed to create chat:", error);
			throw error;
		}
	}
	async getChats(options = { headers: {} }) {
		try {
			const response = await this.api.request("/v1/chats/", { headers: options.headers });
			if (!response.data) {
				console.error("Invalid chats data:", response);
				throw new Error("Invalid chats data received from the server");
			}
			return response.data.map((resource) => resource.attributes);
		} catch (error) {
			console.error("Failed to fetch chats:", error);
			throw error;
		}
	}
	async getChatById(chatId, options = { headers: {} }) {
		try {
			const response = await this.api.request(`/v1/chats/${chatId}`, { headers: options.headers });
			if (!response.data.attributes) {
				console.error("Invalid chat data:", response);
				throw new Error("Invalid chat data received from the server");
			}
			return response.data.attributes;
		} catch (error) {
			console.error("Failed to fetch chat:", error);
			throw error;
		}
	}
	async getChatMessages(chatId, options = { headers: {} }) {
		try {
			const queryParams = new URLSearchParams();
			if (options.limit) queryParams.append("limit", options.limit.toString());
			if (options.offset) queryParams.append("offset", options.offset.toString());
			const url = `/v1/messages/${chatId}/all${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
			const response = await this.api.request(url, { headers: options.headers });
			if (!response.data) {
				console.error("Invalid messages data:", response);
				throw new Error("Invalid messages data received from the server");
			}
			return response.data.map((resource) => resource.attributes);
		} catch (error) {
			console.error("Failed to fetch chat messages:", error);
			throw error;
		}
	}
	async sendMessage(payload, options = { headers: {} }) {
		try {
			await this.api.request("/v1/messages", {
				method: "POST",
				headers: options.headers,
				body: JSON.stringify(payload)
			});
		} catch (error) {
			console.error("Failed to send message:", error);
			throw error;
		}
	}
	async retryMessage(messageId, options = { headers: {} }) {
		try {
			const response = await this.api.request(`/v1/messages/${messageId}/retry`, {
				method: "POST",
				headers: options.headers
			});
			if (!response.data.attributes) {
				console.error("Invalid message data:", response);
				throw new Error("Invalid message data received from the server");
			}
			return response.data.attributes;
		} catch (error) {
			console.error("Failed to retry message:", error);
			throw error;
		}
	}
	async updateChatTitle({ chatId, newTitle }, options = { headers: {} }) {
		try {
			const response = await this.api.request(`/v1/chats/${chatId}`, {
				method: "PATCH",
				headers: options.headers,
				body: JSON.stringify({ title: newTitle })
			});
			if (!response.data.attributes) {
				console.error("Invalid chat data:", response);
				throw new Error("Invalid chat data received from the server");
			}
			return response.data.attributes;
		} catch (error) {
			console.error("Failed to update chat title:", error);
			throw error;
		}
	}
	async deleteChat(chatId, options = { headers: {} }) {
		try {
			await this.api.request(`/v1/chats/${chatId}`, {
				method: "DELETE",
				headers: options.headers
			});
		} catch (error) {
			console.error("Failed to delete chat:", error);
			throw error;
		}
	}
};
var chatApi = new ChatApiClient();
//#endregion
//#region app/feature/chats/hooks/use-chats.ts
var REPLY_POLL_INTERVAL_MS = 2e3;
var REPLY_TIMEOUT_MS = 6e4;
function getMessageReplyStatus(message) {
	return message.metadata?.replyStatus;
}
function isUserMessage(message) {
	return message.senderType === "user";
}
function isReplyAwaiting(message, now = Date.now()) {
	return isUserMessage(message) && getMessageReplyStatus(message) === "pending" && now - new Date(message.timestamp).getTime() < REPLY_TIMEOUT_MS;
}
function hasFailedReply(message) {
	return isUserMessage(message) && getMessageReplyStatus(message) === "failed";
}
function isStalePendingReply(message, now = Date.now()) {
	return isUserMessage(message) && getMessageReplyStatus(message) === "pending" && !isReplyAwaiting(message, now);
}
var chatsKeys = {
	all: ["chats"],
	chats: () => [...chatsKeys.all, "chats"],
	chat: (id) => [
		...chatsKeys.all,
		"chat",
		id
	],
	messages: (chatId) => [
		...chatsKeys.all,
		"messages",
		chatId
	]
};
function useChat(id) {
	return useQuery({
		queryKey: chatsKeys.chat(id),
		queryFn: async () => {
			return await chatApi.getChatById(id);
		},
		enabled: !!id,
		meta: {
			errorToast: true,
			errorMessage: "Failed to load chat"
		}
	});
}
function useCreateChat() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload) => {
			return await chatApi.createChat(payload);
		},
		onSuccess: (data) => {
			toast.success("Chat created successfully!");
			queryClient.invalidateQueries({ queryKey: chatsKeys.chats() });
		},
		onError: (error) => {
			toast.error("Failed to create chat. Please try again.");
			console.error("Create chat error:", error);
		}
	});
}
function useUpdateChatTitle() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ chatId, newTitle }) => {
			return await chatApi.updateChatTitle({
				chatId,
				newTitle
			});
		},
		onSuccess: (data, variables) => {
			toast.success("Chat title updated successfully!");
			queryClient.invalidateQueries({ queryKey: chatsKeys.chats() });
			queryClient.invalidateQueries({ queryKey: chatsKeys.chat(variables.chatId) });
		},
		onError: (error) => {
			toast.error("Failed to update chat title. Please try again.");
			console.error("Update chat title error:", error);
		}
	});
}
function useDeleteChat() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (chatId) => {
			return await chatApi.deleteChat(chatId);
		},
		onSuccess: () => {
			toast.success("Chat deleted successfully!");
			queryClient.invalidateQueries({ queryKey: chatsKeys.chats() });
		},
		onError: (error) => {
			toast.error("Failed to delete chat. Please try again.");
			console.error("Delete chat error:", error);
		}
	});
}
function useMessages(chatId) {
	return useQuery({
		queryKey: chatsKeys.messages(chatId),
		queryFn: async () => {
			return await chatApi.getChatMessages(chatId);
		},
		enabled: !!chatId,
		refetchInterval: (query) => {
			const messages = query.state.data;
			const lastMessage = messages?.[messages.length - 1];
			return lastMessage && isReplyAwaiting(lastMessage) ? REPLY_POLL_INTERVAL_MS : false;
		},
		meta: {
			errorToast: true,
			errorMessage: "Failed to load messages"
		}
	});
}
function useSendMessage() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload) => {
			return await chatApi.sendMessage(payload);
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: chatsKeys.chat(variables.chatId) });
			queryClient.invalidateQueries({ queryKey: chatsKeys.messages(variables.chatId) });
		},
		onError: (error) => {
			toast.error("Failed to send message. Please try again.");
			console.error("Send message error:", error);
		}
	});
}
function useRetryMessage(chatId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (messageId) => {
			return await chatApi.retryMessage(messageId);
		},
		onSuccess: () => {
			toast.success("Reply generation restarted.");
			queryClient.invalidateQueries({ queryKey: chatsKeys.messages(chatId) });
		},
		onError: (error) => {
			toast.error("Failed to retry reply. Please try again.");
			console.error("Retry message error:", error);
		}
	});
}
//#endregion
//#region app/lib/api/generated/api.schemas.ts
var postV1register_Body = z.object({
	email: z.string().max(255).nullable(),
	password: z.string().max(255).nullable(),
	name: z.string().max(255).nullable()
}).passthrough();
var JsonApiError = z.object({
	id: z.string().uuid(),
	status: z.string(),
	code: z.string(),
	title: z.string(),
	detail: z.string(),
	metadata: z.record(z.unknown().nullable()),
	source: z.object({
		pointer: z.string(),
		method: z.string()
	}).partial().passthrough().optional()
}).passthrough();
var JsonApiErrorResponse = z.object({ errors: z.array(JsonApiError) }).passthrough();
var postV1login_Body = z.object({
	email: z.string().max(255).nullable(),
	password: z.string().max(255).nullable()
}).passthrough();
var postV1chats_Body = z.object({
	message: z.string().min(1).max(1e4),
	metadata: z.record(z.unknown().nullable()).optional()
}).passthrough();
var postV1documents_Body = z.object({
	id: z.string().uuid().optional(),
	title: z.string(),
	description: z.string(),
	type: z.string(),
	sections: z.number().int().gte(-2147483648).lte(2147483647),
	lastUpdated: z.string(),
	storageUrl: z.string(),
	downloadCount: z.number().int().gte(-2147483648).lte(2147483647).optional(),
	actName: z.string().nullish(),
	jurisdiction: z.string().nullish(),
	sourceUrl: z.string().nullish(),
	version: z.number().int().gte(-2147483648).lte(2147483647).optional(),
	createdAt: z.string().datetime({ offset: true }).optional(),
	updatedAt: z.string().datetime({ offset: true }).optional()
}).passthrough();
var postV1lawyers_Body = z.object({
	id: z.string().uuid().optional(),
	name: z.string().max(255),
	email: z.string().max(255),
	specialization: z.string().max(100),
	experienceYears: z.number().int().gte(-2147483648).lte(2147483647),
	rating: z.string().max(10).nullish(),
	casesHandled: z.number().int().gte(-2147483648).lte(2147483647).optional(),
	isAvailable: z.boolean().optional(),
	location: z.string().max(100),
	languages: z.array(z.string()),
	createdAt: z.string().datetime({ offset: true }).optional(),
	updatedAt: z.string().datetime({ offset: true }).optional()
}).passthrough();
var putV1lawyersId_Body = z.object({
	id: z.string().uuid(),
	name: z.string().max(255),
	email: z.string().max(255),
	specialization: z.string().max(100),
	experienceYears: z.number().int().gte(-2147483648).lte(2147483647),
	rating: z.string().max(10).nullable(),
	casesHandled: z.number().int().gte(-2147483648).lte(2147483647),
	isAvailable: z.boolean(),
	location: z.string().max(100),
	languages: z.array(z.string()),
	createdAt: z.string().datetime({ offset: true }),
	updatedAt: z.string().datetime({ offset: true })
}).partial().passthrough();
var postV1messages_Body = z.object({
	chatId: z.string().uuid(),
	content: z.string().min(1),
	senderType: z.enum([
		"user",
		"assistant",
		"system"
	]),
	userId: z.string().uuid().nullable(),
	metadata: z.record(z.unknown().nullable()).optional()
}).passthrough();
var postV1users_Body = z.object({
	name: z.string().max(255).nullable(),
	email: z.string().max(255).nullable(),
	password: z.string().max(255).nullable(),
	fingerprint: z.string().max(255).nullable(),
	userAgent: z.string().nullable(),
	lastIp: z.string().max(45).nullable(),
	isAnonymous: z.boolean(),
	age: z.number().int().gte(-2147483648).lte(2147483647).nullable(),
	gender: z.enum([
		"male",
		"female",
		"non_binary",
		"prefer_not_to_say",
		"other",
		null
	]).nullable(),
	country: z.string().max(100).nullable(),
	city: z.string().max(100).nullable(),
	phoneNumber: z.string().max(20).nullable(),
	occupation: z.string().max(100).nullable(),
	bio: z.string().nullable(),
	profilePicture: z.string().nullable(),
	isOnboarded: z.boolean(),
	updatedAt: z.string().datetime({ offset: true })
}).partial().passthrough();
var schemas = {
	postV1register_Body,
	JsonApiError,
	JsonApiErrorResponse,
	postV1login_Body,
	postV1chats_Body,
	postV1documents_Body,
	postV1lawyers_Body,
	putV1lawyersId_Body,
	postV1messages_Body,
	postV1users_Body
};
var endpoints = makeApi([
	{
		method: "post",
		path: "/v1/chats",
		alias: "postV1chats",
		description: `Creates a new chat session with an optional initial message`,
		requestFormat: "json",
		parameters: [{
			name: "body",
			type: "Body",
			schema: postV1chats_Body
		}],
		response: z.object({
			data: z.object({
				type: z.literal("chat"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					userId: z.string().uuid(),
					title: z.string().nullable(),
					metadata: z.union([
						z.string(),
						z.number(),
						z.boolean(),
						z.unknown(),
						z.record(z.unknown().nullable()),
						z.array(z.unknown().nullable())
					]),
					createdAt: z.string().datetime({ offset: true }),
					updatedAt: z.string().datetime({ offset: true })
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough(),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.record(z.unknown().nullable())
		}).passthrough(),
		errors: [
			{
				status: 400,
				description: `The request could not be understood or was missing required parameters.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 401,
				description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 500,
				description: `An unexpected condition was encountered and no more specific message is suitable.`,
				schema: JsonApiErrorResponse
			}
		]
	},
	{
		method: "get",
		path: "/v1/chats",
		alias: "getV1chats",
		description: `Returns a list of chats for the authenticated user`,
		requestFormat: "json",
		response: z.object({
			data: z.array(z.object({
				type: z.literal("chat"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					userId: z.string().uuid(),
					title: z.string().nullable(),
					metadata: z.union([
						z.string(),
						z.number(),
						z.boolean(),
						z.unknown(),
						z.record(z.unknown().nullable()),
						z.array(z.unknown().nullable())
					]),
					createdAt: z.string().datetime({ offset: true }),
					updatedAt: z.string().datetime({ offset: true })
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough()),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.object({
				requestId: z.string(),
				timestamp: z.string(),
				total: z.number().int().gte(0),
				page: z.number().int().gt(0),
				limit: z.number().int().gt(0),
				totalPages: z.number().int().gte(0),
				availableFilters: z.record(z.unknown().nullable()).optional().default({}),
				sortOptions: z.object({
					fields: z.array(z.string()),
					default: z.string(),
					direction: z.enum(["asc", "desc"])
				}).passthrough()
			}).passthrough()
		}).passthrough(),
		errors: [{
			status: 401,
			description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
			schema: JsonApiErrorResponse
		}, {
			status: 500,
			description: `An unexpected condition was encountered and no more specific message is suitable.`,
			schema: JsonApiErrorResponse
		}]
	},
	{
		method: "get",
		path: "/v1/chats/:chatId",
		alias: "getV1chatsChatId",
		description: `Returns a specific chat by its ID`,
		requestFormat: "json",
		response: z.object({
			data: z.object({
				type: z.literal("chat"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					userId: z.string().uuid(),
					title: z.string().nullable(),
					metadata: z.union([
						z.string(),
						z.number(),
						z.boolean(),
						z.unknown(),
						z.record(z.unknown().nullable()),
						z.array(z.unknown().nullable())
					]),
					createdAt: z.string().datetime({ offset: true }),
					updatedAt: z.string().datetime({ offset: true })
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough(),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.record(z.unknown().nullable())
		}).passthrough(),
		errors: [
			{
				status: 401,
				description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 404,
				description: `The requested resource could not be found on the server.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 500,
				description: `An unexpected condition was encountered and no more specific message is suitable.`,
				schema: JsonApiErrorResponse
			}
		]
	},
	{
		method: "get",
		path: "/v1/documents",
		alias: "getV1documents",
		description: `Returns a list of all documents with optional filtering and pagination`,
		requestFormat: "json",
		response: z.object({
			data: z.array(z.object({
				type: z.literal("document"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					title: z.string(),
					description: z.string(),
					type: z.string(),
					sections: z.number().int().gte(-2147483648).lte(2147483647),
					lastUpdated: z.string(),
					storageUrl: z.string(),
					downloadCount: z.number().int().gte(-2147483648).lte(2147483647),
					actName: z.string().nullable(),
					jurisdiction: z.string().nullable(),
					sourceUrl: z.string().nullable(),
					version: z.number().int().gte(-2147483648).lte(2147483647),
					createdAt: z.string().datetime({ offset: true }),
					updatedAt: z.string().datetime({ offset: true })
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough()),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.object({
				requestId: z.string(),
				timestamp: z.string(),
				total: z.number().int().gte(0),
				page: z.number().int().gt(0),
				limit: z.number().int().gt(0),
				totalPages: z.number().int().gte(0),
				availableFilters: z.record(z.unknown().nullable()).optional().default({}),
				sortOptions: z.object({
					fields: z.array(z.string()),
					default: z.string(),
					direction: z.enum(["asc", "desc"])
				}).passthrough()
			}).passthrough()
		}).passthrough(),
		errors: [{
			status: 401,
			description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
			schema: JsonApiErrorResponse
		}, {
			status: 500,
			description: `An unexpected condition was encountered and no more specific message is suitable.`,
			schema: JsonApiErrorResponse
		}]
	},
	{
		method: "post",
		path: "/v1/documents",
		alias: "postV1documents",
		description: `Register a new document in the system`,
		requestFormat: "json",
		parameters: [{
			name: "body",
			type: "Body",
			schema: postV1documents_Body
		}],
		response: z.object({
			data: z.object({
				type: z.literal("document"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					title: z.string(),
					description: z.string(),
					type: z.string(),
					sections: z.number().int().gte(-2147483648).lte(2147483647),
					lastUpdated: z.string(),
					storageUrl: z.string(),
					downloadCount: z.number().int().gte(-2147483648).lte(2147483647),
					actName: z.string().nullable(),
					jurisdiction: z.string().nullable(),
					sourceUrl: z.string().nullable(),
					version: z.number().int().gte(-2147483648).lte(2147483647),
					createdAt: z.string().datetime({ offset: true }),
					updatedAt: z.string().datetime({ offset: true })
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough(),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.record(z.unknown().nullable())
		}).passthrough(),
		errors: [
			{
				status: 400,
				description: `The request could not be understood or was missing required parameters.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 401,
				description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 500,
				description: `An unexpected condition was encountered and no more specific message is suitable.`,
				schema: JsonApiErrorResponse
			}
		]
	},
	{
		method: "get",
		path: "/v1/documents/:id",
		alias: "getV1documentsId",
		description: `Retrieve document details by document ID`,
		requestFormat: "json",
		parameters: [{
			name: "id",
			type: "Path",
			schema: z.string().uuid()
		}],
		response: z.object({
			data: z.object({
				type: z.literal("document"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					title: z.string(),
					description: z.string(),
					type: z.string(),
					sections: z.number().int().gte(-2147483648).lte(2147483647),
					lastUpdated: z.string(),
					storageUrl: z.string(),
					downloadCount: z.number().int().gte(-2147483648).lte(2147483647),
					actName: z.string().nullable(),
					jurisdiction: z.string().nullable(),
					sourceUrl: z.string().nullable(),
					version: z.number().int().gte(-2147483648).lte(2147483647),
					createdAt: z.string().datetime({ offset: true }),
					updatedAt: z.string().datetime({ offset: true })
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough(),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.record(z.unknown().nullable())
		}).passthrough(),
		errors: [
			{
				status: 401,
				description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 404,
				description: `The requested resource could not be found on the server.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 500,
				description: `An unexpected condition was encountered and no more specific message is suitable.`,
				schema: JsonApiErrorResponse
			}
		]
	},
	{
		method: "post",
		path: "/v1/documents/:id/bookmark",
		alias: "postV1documentsIdbookmark",
		description: `Add or remove a bookmark for a document`,
		requestFormat: "json",
		parameters: [{
			name: "id",
			type: "Path",
			schema: z.string().uuid()
		}],
		response: z.object({
			data: z.object({
				type: z.literal("document"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					title: z.string(),
					description: z.string(),
					type: z.string(),
					sections: z.number().int().gte(-2147483648).lte(2147483647),
					lastUpdated: z.string(),
					storageUrl: z.string(),
					downloadCount: z.number().int().gte(-2147483648).lte(2147483647),
					actName: z.string().nullable(),
					jurisdiction: z.string().nullable(),
					sourceUrl: z.string().nullable(),
					version: z.number().int().gte(-2147483648).lte(2147483647),
					createdAt: z.string().datetime({ offset: true }),
					updatedAt: z.string().datetime({ offset: true })
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough(),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.record(z.unknown().nullable())
		}).passthrough(),
		errors: [
			{
				status: 400,
				description: `The request could not be understood or was missing required parameters.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 401,
				description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 404,
				description: `The requested resource could not be found on the server.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 500,
				description: `An unexpected condition was encountered and no more specific message is suitable.`,
				schema: JsonApiErrorResponse
			}
		]
	},
	{
		method: "get",
		path: "/v1/documents/:id/download",
		alias: "getV1documentsIddownload",
		description: `Increment download count and return document details`,
		requestFormat: "json",
		parameters: [{
			name: "id",
			type: "Path",
			schema: z.string().uuid()
		}],
		response: z.object({
			data: z.object({
				type: z.literal("document"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					title: z.string(),
					description: z.string(),
					type: z.string(),
					sections: z.number().int().gte(-2147483648).lte(2147483647),
					lastUpdated: z.string(),
					storageUrl: z.string(),
					downloadCount: z.number().int().gte(-2147483648).lte(2147483647),
					actName: z.string().nullable(),
					jurisdiction: z.string().nullable(),
					sourceUrl: z.string().nullable(),
					version: z.number().int().gte(-2147483648).lte(2147483647),
					createdAt: z.string().datetime({ offset: true }),
					updatedAt: z.string().datetime({ offset: true })
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough(),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.record(z.unknown().nullable())
		}).passthrough(),
		errors: [
			{
				status: 401,
				description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 404,
				description: `The requested resource could not be found on the server.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 500,
				description: `An unexpected condition was encountered and no more specific message is suitable.`,
				schema: JsonApiErrorResponse
			}
		]
	},
	{
		method: "post",
		path: "/v1/documents/ingest",
		alias: "postV1documentsingest",
		description: `Upload and process a document with real-time progress updates via Server-Sent Events`,
		requestFormat: "json",
		parameters: [{
			name: "body",
			type: "Body",
			schema: z.object({ file: z.instanceof(File) }).passthrough()
		}],
		response: z.instanceof(File),
		errors: [{
			status: 400,
			description: `The request could not be understood or was missing required parameters.`,
			schema: JsonApiErrorResponse
		}, {
			status: 401,
			description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
			schema: JsonApiErrorResponse
		}]
	},
	{
		method: "get",
		path: "/v1/lawyers",
		alias: "getV1lawyers",
		description: `Returns a list of all registered lawyers with optional filtering and pagination`,
		requestFormat: "json",
		response: z.object({
			data: z.array(z.object({
				type: z.literal("lawyer"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					name: z.string().max(255),
					email: z.string().max(255),
					specialization: z.string().max(100),
					experienceYears: z.number().int().gte(-2147483648).lte(2147483647),
					rating: z.string().max(10).nullable(),
					casesHandled: z.number().int().gte(-2147483648).lte(2147483647),
					isAvailable: z.boolean(),
					location: z.string().max(100),
					languages: z.array(z.string()),
					createdAt: z.string().datetime({ offset: true }),
					updatedAt: z.string().datetime({ offset: true })
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough()),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.object({
				requestId: z.string(),
				timestamp: z.string(),
				total: z.number().int().gte(0),
				page: z.number().int().gt(0),
				limit: z.number().int().gt(0),
				totalPages: z.number().int().gte(0),
				availableFilters: z.record(z.unknown().nullable()).optional().default({}),
				sortOptions: z.object({
					fields: z.array(z.string()),
					default: z.string(),
					direction: z.enum(["asc", "desc"])
				}).passthrough()
			}).passthrough()
		}).passthrough(),
		errors: [{
			status: 401,
			description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
			schema: JsonApiErrorResponse
		}, {
			status: 500,
			description: `An unexpected condition was encountered and no more specific message is suitable.`,
			schema: JsonApiErrorResponse
		}]
	},
	{
		method: "post",
		path: "/v1/lawyers",
		alias: "postV1lawyers",
		description: `Register a new lawyer in the system`,
		requestFormat: "json",
		parameters: [{
			name: "body",
			type: "Body",
			schema: postV1lawyers_Body
		}],
		response: z.object({
			data: z.object({
				type: z.literal("lawyer"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					name: z.string().max(255),
					email: z.string().max(255),
					specialization: z.string().max(100),
					experienceYears: z.number().int().gte(-2147483648).lte(2147483647),
					rating: z.string().max(10).nullable(),
					casesHandled: z.number().int().gte(-2147483648).lte(2147483647),
					isAvailable: z.boolean(),
					location: z.string().max(100),
					languages: z.array(z.string()),
					createdAt: z.string().datetime({ offset: true }),
					updatedAt: z.string().datetime({ offset: true })
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough(),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.record(z.unknown().nullable())
		}).passthrough(),
		errors: [
			{
				status: 400,
				description: `The request could not be understood or was missing required parameters.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 401,
				description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 409,
				description: `The request could not be completed due to a conflict with the current state of the target resource.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 500,
				description: `An unexpected condition was encountered and no more specific message is suitable.`,
				schema: JsonApiErrorResponse
			}
		]
	},
	{
		method: "get",
		path: "/v1/lawyers/:id",
		alias: "getV1lawyersId",
		description: `Retrieve lawyer details by lawyer ID`,
		requestFormat: "json",
		parameters: [{
			name: "id",
			type: "Path",
			schema: z.string().uuid()
		}],
		response: z.object({
			data: z.object({
				type: z.literal("lawyer"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					name: z.string().max(255),
					email: z.string().max(255),
					specialization: z.string().max(100),
					experienceYears: z.number().int().gte(-2147483648).lte(2147483647),
					rating: z.string().max(10).nullable(),
					casesHandled: z.number().int().gte(-2147483648).lte(2147483647),
					isAvailable: z.boolean(),
					location: z.string().max(100),
					languages: z.array(z.string()),
					createdAt: z.string().datetime({ offset: true }),
					updatedAt: z.string().datetime({ offset: true })
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough(),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.record(z.unknown().nullable())
		}).passthrough(),
		errors: [
			{
				status: 401,
				description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 404,
				description: `The requested resource could not be found on the server.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 500,
				description: `An unexpected condition was encountered and no more specific message is suitable.`,
				schema: JsonApiErrorResponse
			}
		]
	},
	{
		method: "put",
		path: "/v1/lawyers/:id",
		alias: "putV1lawyersId",
		description: `Update an existing lawyer&#x27;s information`,
		requestFormat: "json",
		parameters: [{
			name: "body",
			type: "Body",
			schema: putV1lawyersId_Body
		}, {
			name: "id",
			type: "Path",
			schema: z.string().uuid()
		}],
		response: z.object({
			data: z.object({
				type: z.literal("lawyer"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					name: z.string().max(255),
					email: z.string().max(255),
					specialization: z.string().max(100),
					experienceYears: z.number().int().gte(-2147483648).lte(2147483647),
					rating: z.string().max(10).nullable(),
					casesHandled: z.number().int().gte(-2147483648).lte(2147483647),
					isAvailable: z.boolean(),
					location: z.string().max(100),
					languages: z.array(z.string()),
					createdAt: z.string().datetime({ offset: true }),
					updatedAt: z.string().datetime({ offset: true })
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough(),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.record(z.unknown().nullable())
		}).passthrough(),
		errors: [
			{
				status: 400,
				description: `The request could not be understood or was missing required parameters.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 401,
				description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 404,
				description: `The requested resource could not be found on the server.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 500,
				description: `An unexpected condition was encountered and no more specific message is suitable.`,
				schema: JsonApiErrorResponse
			}
		]
	},
	{
		method: "post",
		path: "/v1/login",
		alias: "postV1login",
		description: `Authenticates an existing user account`,
		requestFormat: "json",
		parameters: [{
			name: "body",
			type: "Body",
			schema: postV1login_Body
		}],
		response: z.object({
			email: z.string().max(255).nullable(),
			password: z.string().max(255).nullable()
		}).passthrough(),
		errors: [
			{
				status: 400,
				description: `The request could not be understood or was missing required parameters.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 401,
				description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 500,
				description: `An unexpected condition was encountered and no more specific message is suitable.`,
				schema: JsonApiErrorResponse
			}
		]
	},
	{
		method: "post",
		path: "/v1/messages",
		alias: "postV1messages",
		description: `Send a new message to a chat`,
		requestFormat: "json",
		parameters: [{
			name: "body",
			type: "Body",
			schema: postV1messages_Body
		}],
		response: z.object({
			data: z.object({
				type: z.literal("message"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					chatId: z.string().uuid(),
					content: z.string(),
					senderType: z.enum([
						"user",
						"assistant",
						"system"
					]),
					userId: z.string().uuid().nullable(),
					timestamp: z.string().datetime({ offset: true }),
					metadata: z.union([
						z.string(),
						z.number(),
						z.boolean(),
						z.unknown(),
						z.record(z.unknown().nullable()),
						z.array(z.unknown().nullable())
					])
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough(),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.record(z.unknown().nullable())
		}).passthrough(),
		errors: [
			{
				status: 400,
				description: `The request could not be understood or was missing required parameters.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 401,
				description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 404,
				description: `The requested resource could not be found on the server.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 500,
				description: `An unexpected condition was encountered and no more specific message is suitable.`,
				schema: JsonApiErrorResponse
			}
		]
	},
	{
		method: "get",
		path: "/v1/messages/:chatId/all",
		alias: "getV1messagesChatIdall",
		description: `Retrieve all messages for a specific chat`,
		requestFormat: "json",
		response: z.object({
			data: z.array(z.object({
				type: z.literal("message"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					chatId: z.string().uuid(),
					content: z.string(),
					senderType: z.enum([
						"user",
						"assistant",
						"system"
					]),
					userId: z.string().uuid().nullable(),
					timestamp: z.string().datetime({ offset: true }),
					metadata: z.union([
						z.string(),
						z.number(),
						z.boolean(),
						z.unknown(),
						z.record(z.unknown().nullable()),
						z.array(z.unknown().nullable())
					])
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough()),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.object({
				requestId: z.string(),
				timestamp: z.string(),
				total: z.number().int().gte(0),
				page: z.number().int().gt(0),
				limit: z.number().int().gt(0),
				totalPages: z.number().int().gte(0),
				availableFilters: z.record(z.unknown().nullable()).optional().default({}),
				sortOptions: z.object({
					fields: z.array(z.string()),
					default: z.string(),
					direction: z.enum(["asc", "desc"])
				}).passthrough()
			}).passthrough()
		}).passthrough(),
		errors: [
			{
				status: 401,
				description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 404,
				description: `The requested resource could not be found on the server.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 500,
				description: `An unexpected condition was encountered and no more specific message is suitable.`,
				schema: JsonApiErrorResponse
			}
		]
	},
	{
		method: "post",
		path: "/v1/messages/:messageId/retry",
		alias: "postV1messagesMessageIdretry",
		description: `Reset the reply status to pending and re-enqueue the reply job for a user message`,
		requestFormat: "json",
		response: z.object({
			data: z.object({
				type: z.literal("message"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					chatId: z.string().uuid(),
					content: z.string(),
					senderType: z.enum([
						"user",
						"assistant",
						"system"
					]),
					userId: z.string().uuid().nullable(),
					timestamp: z.string().datetime({ offset: true }),
					metadata: z.union([
						z.string(),
						z.number(),
						z.boolean(),
						z.unknown(),
						z.record(z.unknown().nullable()),
						z.array(z.unknown().nullable())
					])
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough(),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.record(z.unknown().nullable())
		}).passthrough(),
		errors: [
			{
				status: 400,
				description: `The request could not be understood or was missing required parameters.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 401,
				description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 404,
				description: `The requested resource could not be found on the server.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 500,
				description: `An unexpected condition was encountered and no more specific message is suitable.`,
				schema: JsonApiErrorResponse
			}
		]
	},
	{
		method: "post",
		path: "/v1/register",
		alias: "postV1register",
		description: `Creates a new user account profile`,
		requestFormat: "json",
		parameters: [{
			name: "body",
			type: "Body",
			schema: postV1register_Body
		}],
		response: z.object({
			email: z.string().max(255).nullable(),
			password: z.string().max(255).nullable(),
			name: z.string().max(255).nullable()
		}).passthrough(),
		errors: [
			{
				status: 400,
				description: `The request could not be understood or was missing required parameters.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 409,
				description: `The request could not be completed due to a conflict with the current state of the target resource.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 500,
				description: `An unexpected condition was encountered and no more specific message is suitable.`,
				schema: JsonApiErrorResponse
			}
		]
	},
	{
		method: "get",
		path: "/v1/services",
		alias: "getV1services",
		description: `Returns a list of all available legal services with optional category filtering`,
		requestFormat: "json",
		response: z.object({
			data: z.array(z.object({
				type: z.literal("legal-service"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					name: z.string(),
					categoryId: z.string().nullable(),
					slug: z.string(),
					description: z.string().nullable(),
					createdAt: z.string().datetime({ offset: true })
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough()),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.object({
				requestId: z.string(),
				timestamp: z.string(),
				total: z.number().int().gte(0),
				page: z.number().int().gt(0),
				limit: z.number().int().gt(0),
				totalPages: z.number().int().gte(0),
				availableFilters: z.record(z.unknown().nullable()).optional().default({}),
				sortOptions: z.object({
					fields: z.array(z.string()),
					default: z.string(),
					direction: z.enum(["asc", "desc"])
				}).passthrough()
			}).passthrough()
		}).passthrough(),
		errors: [{
			status: 401,
			description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
			schema: JsonApiErrorResponse
		}, {
			status: 500,
			description: `An unexpected condition was encountered and no more specific message is suitable.`,
			schema: JsonApiErrorResponse
		}]
	},
	{
		method: "get",
		path: "/v1/users",
		alias: "getV1users",
		description: `Returns a paginated list of users with filtering and sorting options`,
		requestFormat: "json",
		response: z.object({
			data: z.array(z.object({
				type: z.literal("user"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					name: z.string().max(255).nullable(),
					email: z.string().max(255).nullable(),
					role: z.enum([
						"user",
						"admin",
						"lawyer"
					]),
					userAgent: z.string().nullable(),
					lastIp: z.string().max(45).nullable(),
					isAnonymous: z.boolean(),
					age: z.number().int().gte(-2147483648).lte(2147483647).nullable(),
					gender: z.enum([
						"male",
						"female",
						"non_binary",
						"prefer_not_to_say",
						"other",
						null
					]).nullable(),
					country: z.string().max(100).nullable(),
					city: z.string().max(100).nullable(),
					phoneNumber: z.string().max(20).nullable(),
					occupation: z.string().max(100).nullable(),
					bio: z.string().nullable(),
					profilePicture: z.string().nullable(),
					isOnboarded: z.boolean(),
					createdAt: z.string().datetime({ offset: true }),
					updatedAt: z.string().datetime({ offset: true })
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough()),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.object({
				requestId: z.string(),
				timestamp: z.string(),
				total: z.number().int().gte(0),
				page: z.number().int().gt(0),
				limit: z.number().int().gt(0),
				totalPages: z.number().int().gte(0),
				availableFilters: z.record(z.unknown().nullable()).optional().default({}),
				sortOptions: z.object({
					fields: z.array(z.string()),
					default: z.string(),
					direction: z.enum(["asc", "desc"])
				}).passthrough()
			}).passthrough()
		}).passthrough(),
		errors: [{
			status: 401,
			description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
			schema: JsonApiErrorResponse
		}, {
			status: 403,
			description: `The server understood the request but refuses to authorize it.`,
			schema: JsonApiErrorResponse
		}]
	},
	{
		method: "post",
		path: "/v1/users",
		alias: "postV1users",
		description: `Register a new user account. Can be used for both anonymous and registered users.`,
		requestFormat: "json",
		parameters: [{
			name: "body",
			type: "Body",
			schema: postV1users_Body
		}],
		response: z.object({
			data: z.object({
				type: z.literal("user"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					name: z.string().max(255).nullable(),
					email: z.string().max(255).nullable(),
					role: z.enum([
						"user",
						"admin",
						"lawyer"
					]),
					userAgent: z.string().nullable(),
					lastIp: z.string().max(45).nullable(),
					isAnonymous: z.boolean(),
					age: z.number().int().gte(-2147483648).lte(2147483647).nullable(),
					gender: z.enum([
						"male",
						"female",
						"non_binary",
						"prefer_not_to_say",
						"other",
						null
					]).nullable(),
					country: z.string().max(100).nullable(),
					city: z.string().max(100).nullable(),
					phoneNumber: z.string().max(20).nullable(),
					occupation: z.string().max(100).nullable(),
					bio: z.string().nullable(),
					profilePicture: z.string().nullable(),
					isOnboarded: z.boolean(),
					createdAt: z.string().datetime({ offset: true }),
					updatedAt: z.string().datetime({ offset: true })
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough(),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.record(z.unknown().nullable())
		}).passthrough(),
		errors: [
			{
				status: 400,
				description: `The request could not be understood or was missing required parameters.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 401,
				description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 409,
				description: `The request could not be completed due to a conflict with the current state of the target resource.`,
				schema: JsonApiErrorResponse
			}
		]
	},
	{
		method: "get",
		path: "/v1/users/:id",
		alias: "getV1usersId",
		description: `Retrieve user details by user ID. Users can only view their own profile unless they are admins.`,
		requestFormat: "json",
		parameters: [{
			name: "id",
			type: "Path",
			schema: z.string().uuid()
		}],
		response: z.object({
			data: z.object({
				type: z.literal("user"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					name: z.string().max(255).nullable(),
					email: z.string().max(255).nullable(),
					role: z.enum([
						"user",
						"admin",
						"lawyer"
					]),
					userAgent: z.string().nullable(),
					lastIp: z.string().max(45).nullable(),
					isAnonymous: z.boolean(),
					age: z.number().int().gte(-2147483648).lte(2147483647).nullable(),
					gender: z.enum([
						"male",
						"female",
						"non_binary",
						"prefer_not_to_say",
						"other",
						null
					]).nullable(),
					country: z.string().max(100).nullable(),
					city: z.string().max(100).nullable(),
					phoneNumber: z.string().max(20).nullable(),
					occupation: z.string().max(100).nullable(),
					bio: z.string().nullable(),
					profilePicture: z.string().nullable(),
					isOnboarded: z.boolean(),
					createdAt: z.string().datetime({ offset: true }),
					updatedAt: z.string().datetime({ offset: true })
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough(),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.record(z.unknown().nullable())
		}).passthrough(),
		errors: [
			{
				status: 401,
				description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 403,
				description: `The server understood the request but refuses to authorize it.`,
				schema: JsonApiErrorResponse
			},
			{
				status: 404,
				description: `The requested resource could not be found on the server.`,
				schema: JsonApiErrorResponse
			}
		]
	},
	{
		method: "get",
		path: "/v1/users/me",
		alias: "getV1usersme",
		description: `Returns the currently authenticated user&#x27;s profile information.`,
		requestFormat: "json",
		response: z.object({
			data: z.object({
				type: z.literal("user"),
				id: z.string().uuid(),
				attributes: z.object({
					id: z.string().uuid(),
					name: z.string().max(255).nullable(),
					email: z.string().max(255).nullable(),
					role: z.enum([
						"user",
						"admin",
						"lawyer"
					]),
					userAgent: z.string().nullable(),
					lastIp: z.string().max(45).nullable(),
					isAnonymous: z.boolean(),
					age: z.number().int().gte(-2147483648).lte(2147483647).nullable(),
					gender: z.enum([
						"male",
						"female",
						"non_binary",
						"prefer_not_to_say",
						"other",
						null
					]).nullable(),
					country: z.string().max(100).nullable(),
					city: z.string().max(100).nullable(),
					phoneNumber: z.string().max(20).nullable(),
					occupation: z.string().max(100).nullable(),
					bio: z.string().nullable(),
					profilePicture: z.string().nullable(),
					isOnboarded: z.boolean(),
					createdAt: z.string().datetime({ offset: true }),
					updatedAt: z.string().datetime({ offset: true })
				}).passthrough(),
				relationships: z.record(z.unknown().nullable()).optional(),
				meta: z.record(z.unknown().nullable()).optional(),
				links: z.record(z.string()).optional()
			}).passthrough(),
			links: z.object({ self: z.string() }).passthrough(),
			metadata: z.record(z.unknown().nullable())
		}).passthrough(),
		errors: [{
			status: 401,
			description: `Authentication failed or user doesn&#x27;t have permissions for the requested operation.`,
			schema: JsonApiErrorResponse
		}, {
			status: 500,
			description: `An unexpected condition was encountered and no more specific message is suitable.`,
			schema: JsonApiErrorResponse
		}]
	}
]);
new Zodios(endpoints);
//#endregion
//#region app/components/ui/textarea.tsx
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ jsx("textarea", {
		"data-slot": "textarea",
		className: cn("border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		...props
	});
}
//#endregion
//#region app/components/ui/input-group.tsx
function InputGroup({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "input-group",
		role: "group",
		className: cn("group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none", "h-9 min-w-0 has-[>textarea]:h-auto", "has-[>[data-align=inline-start]]:[&>input]:pl-2", "has-[>[data-align=inline-end]]:[&>input]:pr-2", "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3", "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3", "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]", "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40", className),
		...props
	});
}
var inputGroupAddonVariants = cva("text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none [&>svg:not([class*='size-'])]:size-4 [&>kbd]:rounded-[calc(var(--radius)-5px)] group-data-[disabled=true]/input-group:opacity-50", {
	variants: { align: {
		"inline-start": "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
		"inline-end": "order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]",
		"block-start": "order-first w-full justify-start px-3 pt-3 [.border-b]:pb-3 group-has-[>input]/input-group:pt-2.5",
		"block-end": "order-last w-full justify-start px-3 pb-3 [.border-t]:pt-3 group-has-[>input]/input-group:pb-2.5"
	} },
	defaultVariants: { align: "inline-start" }
});
function InputGroupAddon({ className, align = "inline-start", ...props }) {
	return /* @__PURE__ */ jsx("div", {
		role: "group",
		"data-slot": "input-group-addon",
		"data-align": align,
		className: cn(inputGroupAddonVariants({ align }), className),
		onClick: (e) => {
			if (e.target.closest("button")) return;
			e.currentTarget.parentElement?.querySelector("input")?.focus();
		},
		...props
	});
}
var inputGroupButtonVariants = cva("text-sm shadow-none flex gap-2 items-center", {
	variants: { size: {
		xs: "h-6 gap-1 px-2 rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-3.5 has-[>svg]:px-2",
		sm: "h-8 px-2.5 gap-1.5 rounded-md has-[>svg]:px-2.5",
		"icon-xs": "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
		"icon-sm": "size-8 p-0 has-[>svg]:p-0"
	} },
	defaultVariants: { size: "xs" }
});
function InputGroupButton({ className, type = "button", variant = "ghost", size = "xs", ...props }) {
	return /* @__PURE__ */ jsx(Button, {
		type,
		"data-size": size,
		variant,
		className: cn(inputGroupButtonVariants({ size }), className),
		...props
	});
}
function InputGroupText({ className, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		className: cn("text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4", className),
		...props
	});
}
function InputGroupInput({ className, ...props }) {
	return /* @__PURE__ */ jsx(Input, {
		"data-slot": "input-group-control",
		className: cn("flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent", className),
		...props
	});
}
function InputGroupTextarea({ className, ...props }) {
	return /* @__PURE__ */ jsx(Textarea, {
		"data-slot": "input-group-control",
		className: cn("flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent", className),
		...props
	});
}
//#endregion
//#region app/components/ui/upload-dropdown.tsx
function UploadDropdown({ onFileUpload, disabled = false }) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);
	const fileInputRef = useRef(null);
	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	const handleFileSelect = (event) => {
		const files = Array.from(event.target.files || []);
		if (files.length > 0) {
			onFileUpload(files);
			setIsOpen(false);
		}
		event.target.value = "";
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "relative",
		ref: dropdownRef,
		children: [
			/* @__PURE__ */ jsx(Button, {
				type: "button",
				onClick: () => setIsOpen(!isOpen),
				variant: "outline",
				size: "icon",
				disabled,
				"aria-label": "Upload content",
				children: /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" })
			}),
			isOpen && /* @__PURE__ */ jsx("div", {
				className: "absolute left-0 bottom-full mb-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50",
				children: /* @__PURE__ */ jsx("div", {
					className: "py-1",
					children: /* @__PURE__ */ jsxs(Button, {
						type: "button",
						onClick: () => fileInputRef.current?.click(),
						variant: "ghost",
						size: "sm",
						children: [/* @__PURE__ */ jsx(File$1, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Upload PDF" })]
					})
				})
			}),
			/* @__PURE__ */ jsx("input", {
				ref: fileInputRef,
				type: "file",
				multiple: true,
				onChange: handleFileSelect,
				className: "hidden",
				accept: ".pdf,application/pdf"
			})
		]
	});
}
//#endregion
//#region app/lib/api/documents.api.ts
var getClientToken = () => {
	if (typeof document === "undefined") return null;
	return parseCookies(document.cookie).token ?? null;
};
var parseSSEBlock = (block) => {
	const lines = block.split("\n");
	let type = "message";
	const dataLines = [];
	for (const line of lines) {
		const trimmed = line.replace(/\r$/, "");
		if (trimmed.startsWith(":")) continue;
		if (trimmed.startsWith("event:")) type = trimmed.slice(6).trim();
		else if (trimmed.startsWith("data:")) dataLines.push(trimmed.slice(5).trim());
	}
	if (dataLines.length === 0) return null;
	return {
		type,
		data: JSON.parse(dataLines.join("\n"))
	};
};
var DocumentsApiClient = class {
	api;
	constructor() {
		this.api = new FetchApiClient();
	}
	async getDocuments() {
		try {
			const response = await this.api.request(DOCUMENTS_API_ROUTES.ROOT);
			if (!response.data) {
				console.error("Invalid documents data:", response);
				throw new Error("Invalid documents data received from the server");
			}
			return response.data.map((resource) => resource.attributes);
		} catch (error) {
			console.error("Failed to fetch documents:", error);
			throw error;
		}
	}
	async getDocumentById(documentId) {
		try {
			const response = await this.api.request(DOCUMENTS_API_ROUTES.DOCUMENT.replace(":documentId", String(documentId)));
			if (!response.data.attributes) {
				console.error("Invalid document data:", response);
				throw new Error("Invalid document data received from the server");
			}
			return response.data.attributes;
		} catch (error) {
			console.error("Failed to fetch document:", error);
			throw error;
		}
	}
	async uploadDocument(file, options = {}, onEvent, signal) {
		const formData = new FormData();
		formData.append("file", file);
		if (options.title) formData.append("title", options.title);
		if (options.description) formData.append("description", options.description);
		if (options.type) formData.append("type", options.type);
		const baseURL = "http://localhost:3000/api";
		const token = getClientToken();
		const response = await fetch(`${baseURL}${DOCUMENTS_API_ROUTES.INGEST}`, {
			method: "POST",
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			body: formData,
			credentials: "include",
			signal
		});
		if (!response.ok) {
			let message = `Upload failed with status ${response.status}`;
			try {
				const errorData = await response.json();
				message = errorData.errors?.[0]?.detail || errorData.errors?.[0]?.title || message;
			} catch {}
			throw new Error(message);
		}
		if (!response.body) throw new Error("No response body received from the server");
		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let buffer = "";
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			buffer += decoder.decode(value, { stream: true });
			let boundary = buffer.indexOf("\n\n");
			while (boundary !== -1) {
				const block = buffer.slice(0, boundary);
				buffer = buffer.slice(boundary + 2);
				const parsed = parseSSEBlock(block);
				if (parsed) onEvent(parsed);
				boundary = buffer.indexOf("\n\n");
			}
		}
	}
};
var documentsApi = new DocumentsApiClient();
//#endregion
//#region app/feature/documents/hooks/use-documents.ts
var documentsKeys = {
	all: ["documents"],
	documents: () => [...documentsKeys.all, "documents"],
	document: (id) => [
		...documentsKeys.all,
		"document",
		id
	]
};
var getUploadKey = (file) => `${file.name}|${file.lastModified}|${file.size}`;
function useUploadDocument() {
	const [uploads, setUploads] = useState({});
	return {
		uploads,
		upload: useCallback(async (files) => {
			let allSucceeded = true;
			for (const file of files) {
				const key = getUploadKey(file);
				setUploads((prev) => ({
					...prev,
					[key]: {
						status: "uploading",
						percentage: 0
					}
				}));
				try {
					await documentsApi.uploadDocument(file, { title: file.name }, (event) => {
						if (event.type === "progress") setUploads((prev) => ({
							...prev,
							[key]: {
								status: "uploading",
								percentage: event.data.percentage
							}
						}));
						else if (event.type === "completed") setUploads((prev) => ({
							...prev,
							[key]: {
								status: "completed",
								percentage: 100
							}
						}));
						else if (event.type === "error") setUploads((prev) => ({
							...prev,
							[key]: {
								status: "error",
								percentage: 0,
								message: event.data.message
							}
						}));
					});
				} catch (error) {
					allSucceeded = false;
					setUploads((prev) => ({
						...prev,
						[key]: {
							status: "error",
							percentage: 0,
							message: error instanceof Error ? error.message : String(error)
						}
					}));
				}
			}
			return allSucceeded;
		}, []),
		clearUploads: useCallback(() => setUploads({}), []),
		isUploading: Object.values(uploads).some((progress) => progress.status === "uploading"),
		hasErrors: Object.values(uploads).some((progress) => progress.status === "error")
	};
}
function useDocuments() {
	return useQuery({
		queryKey: documentsKeys.documents(),
		queryFn: async () => {
			return await documentsApi.getDocuments();
		},
		meta: {
			errorToast: true,
			errorMessage: "Failed to load documents"
		}
	});
}
function useDocument(id) {
	return useQuery({
		queryKey: documentsKeys.document(id),
		queryFn: async () => {
			return await documentsApi.getDocumentById(id);
		},
		enabled: !!id,
		meta: {
			errorToast: true,
			errorMessage: "Failed to load document"
		}
	});
}
//#endregion
//#region app/feature/chats/components/chat-form.tsx
var createChatRequestSchema = schemas.postV1chats_Body;
var ChatForm = ({ onSubmit, isSubmitting, disabled = false }) => {
	const [attachedFiles, setAttachedFiles] = useState([]);
	const { uploads, upload, clearUploads, isUploading } = useUploadDocument();
	const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({ resolver: zodResolver(createChatRequestSchema) });
	const question = watch("message");
	const handleFileUpload = (event) => {
		const files = Array.from(event.target.files || []);
		setAttachedFiles((prev) => [...prev, ...files]);
	};
	const removeFile = (index) => {
		setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
	};
	const onFormSubmit = async (data) => {
		if (attachedFiles.length > 0) {
			if (!await upload(attachedFiles)) return;
			setAttachedFiles([]);
			clearUploads();
		}
		onSubmit(data);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4 max-w-5xl mx-auto",
		children: [/* @__PURE__ */ jsx("div", {
			className: "w-full",
			children: /* @__PURE__ */ jsxs(InputGroup, {
				className: "border rounded-xl",
				children: [/* @__PURE__ */ jsx(InputGroupTextarea, {
					id: "message",
					...register("message"),
					placeholder: "Describe your legal situation in detail...",
					className: "min-h-[50px] font-medium",
					required: true,
					disabled
				}), /* @__PURE__ */ jsxs(InputGroupAddon, {
					align: "block-end",
					children: [
						/* @__PURE__ */ jsx(UploadDropdown, {
							onFileUpload: handleFileUpload,
							disabled: isSubmitting || isUploading || disabled
						}),
						/* @__PURE__ */ jsx(InputGroupText, {
							className: "ml-auto font-medium",
							children: "Auto"
						}),
						/* @__PURE__ */ jsx(Separator, {
							orientation: "vertical",
							className: "!h-4"
						}),
						/* @__PURE__ */ jsxs(InputGroupButton, {
							type: "submit",
							variant: "default",
							className: "rounded-full bg-blue-600 hover:bg-blue-700 border-2 border-gray-900 shadow-[2px_2px_0_0_#000]",
							size: "icon-xs",
							disabled: !question?.trim() || isSubmitting || isUploading || disabled,
							onClick: handleSubmit(onFormSubmit),
							children: [isSubmitting || isUploading ? /* @__PURE__ */ jsx("div", { className: "w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsx(ArrowUp, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", {
								className: "sr-only",
								children: "Send"
							})]
						})
					]
				})]
			})
		}), attachedFiles.length > 0 && /* @__PURE__ */ jsxs("div", {
			className: "mt-3 space-y-2",
			children: [/* @__PURE__ */ jsx("p", {
				className: "text-sm font-medium text-gray-700",
				children: "Attached files:"
			}), attachedFiles.map((file, index) => {
				const progress = uploads[getUploadKey(file)];
				return /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex-1 min-w-0",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-sm text-gray-700 truncate block",
								children: file.name
							}),
							progress && progress.status !== "completed" && /* @__PURE__ */ jsx("span", {
								className: `text-xs ${progress.status === "error" ? "text-red-600" : "text-blue-600"}`,
								children: progress.status === "error" ? progress.message ?? "Upload failed" : `Uploading... ${progress.percentage}%`
							}),
							progress?.status === "completed" && /* @__PURE__ */ jsx("span", {
								className: "text-xs text-green-600",
								children: "Uploaded successfully"
							})
						]
					}), /* @__PURE__ */ jsx(Button, {
						type: "button",
						variant: "ghost",
						size: "sm",
						onClick: () => removeFile(index),
						className: "text-red-500 hover:text-red-700",
						children: "Remove"
					})]
				}, `${file.name}-${index}`);
			})]
		})]
	});
};
//#endregion
//#region app/feature/chats/components/suggested-questions.tsx
var suggestedQuestions = [
	"What are my rights as a tenant in a rental dispute?",
	"How do I file for divorce and what documents do I need?",
	"What are the penalties for traffic violations?",
	"How can I protect my business intellectual property?"
];
var SuggestedQuestions = ({ onQuestionClick, disabled = false }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-5xl mx-auto",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "text-sm font-bold text-gray-700 uppercase tracking-wider mb-4",
			children: "Or try one of these:"
		}), /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 md:grid-cols-2 gap-3",
			children: suggestedQuestions.map((q, index) => /* @__PURE__ */ jsx("button", {
				onClick: () => onQuestionClick(q),
				disabled,
				className: "text-left p-4 border-2 border-gray-900 bg-white hover:bg-gray-50 transition-all hover:shadow-md text-gray-700 hover:text-gray-900 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed",
				style: {
					boxShadow: "2px 2px 0 0 #000",
					borderRadius: "4px 8px 4px 8px"
				},
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ jsx("span", { children: q }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 flex-shrink-0 mt-0.5" })]
				})
			}, index))
		})]
	});
};
//#endregion
//#region app/feature/chats/screens/NewChatScreen.tsx
var NewChatScreen = () => {
	const navigate = useNavigate();
	const createChatMutation = useCreateChat();
	const handleFormSubmit = (data) => {
		createChatMutation.mutate(data, {
			onSuccess: (newChat) => {
				navigate(`/chats/${newChat.id}`);
			},
			onError: (error) => {}
		});
	};
	const handleSuggestedQuestion = (question) => {
		handleFormSubmit({ message: question });
	};
	return /* @__PURE__ */ jsx("div", {
		className: "flex",
		children: /* @__PURE__ */ jsx("div", {
			className: "flex-1 flex items-center justify-center",
			children: /* @__PURE__ */ jsxs("div", {
				className: "w-full text-center space-y-8",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "flex justify-center mb-4",
						children: /* @__PURE__ */ jsx(IconContainer, {
							icon: Scale,
							size: "lg"
						})
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "text-3xl font-black text-gray-900 text-center mb-8",
						children: "What's your legal question?"
					}),
					/* @__PURE__ */ jsx(ChatForm, {
						onSubmit: handleFormSubmit,
						isSubmitting: createChatMutation.isPending,
						disabled: createChatMutation.isPending
					}),
					/* @__PURE__ */ jsx(SuggestedQuestions, { onQuestionClick: handleSuggestedQuestion })
				]
			})
		})
	});
};
//#endregion
//#region app/routes/app/index.tsx
var app_exports = /* @__PURE__ */ __exportAll({
	default: () => app_default,
	meta: () => meta$16
});
function meta$16({ loaderData }) {
	return [
		{ title: "Mahakama - Legal Knowledge for Everyone in South Sudan & Uganda" },
		{
			name: "description",
			content: "Get free, plain-language answers to your legal questions about South Sudan and Uganda. Understand your rights without the legal jargon. No law degree required."
		},
		{
			name: "keywords",
			content: "legal rights South Sudan, Uganda law, free legal advice, legal help, understand laws, tenant rights, worker rights, consumer protection, legal documents, mahakama"
		},
		{
			name: "og:title",
			content: "Mahakama - Legal Knowledge for Everyone in South Sudan & Uganda"
		},
		{
			name: "og:description",
			content: "Empowering citizens with free, easy-to-understand legal information. Know your rights in plain language before you need a lawyer."
		},
		{
			name: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:title",
			content: "Mahakama - Legal Knowledge for Everyone"
		},
		{
			name: "twitter:description",
			content: "Demystifying the law in South Sudan and Uganda with AI-powered legal assistance in plain language."
		}
	];
}
var app_default = UNSAFE_withComponentProps(function Home() {
	return /* @__PURE__ */ jsx(NewChatScreen, {});
});
//#endregion
//#region app/feature/notifications/components/NotificationItem.tsx
var NotificationItem = ({ notification }) => {
	const getStatusColor = (status) => {
		switch (status) {
			case "read": return "bg-gray-100 text-gray-800";
			case "sent": return "bg-blue-100 text-blue-800";
			case "delivered": return "bg-green-100 text-green-800";
			case "failed": return "bg-red-100 text-red-800";
			case "pending": return "bg-yellow-100 text-yellow-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};
	const getChannelIcon = (channel) => {
		switch (channel) {
			case "push": return "📱";
			case "email": return "📧";
			case "in_app": return "🔔";
			default: return "📢";
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "border border-gray-200 rounded-lg p-4 mb-3 bg-white shadow-sm",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between mb-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-lg",
						children: getChannelIcon(notification.channel)
					}), /* @__PURE__ */ jsx("h3", {
						className: "font-semibold text-gray-900",
						children: notification.title
					})]
				}), /* @__PURE__ */ jsx("span", {
					className: `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`,
					children: notification.status
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-gray-700 mb-3",
				children: notification.message
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between text-xs text-gray-500",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ jsxs("span", { children: ["Type: ", notification.type] }), /* @__PURE__ */ jsxs("span", { children: ["Channel: ", notification.channel] })]
				}), /* @__PURE__ */ jsxs("div", {
					className: "text-right",
					children: [/* @__PURE__ */ jsxs("div", { children: ["Created: ", new Date(notification.createdAt).toLocaleDateString()] }), notification.sentAt && /* @__PURE__ */ jsxs("div", { children: ["Sent: ", new Date(notification.sentAt).toLocaleDateString()] })]
				})]
			})
		]
	});
};
//#endregion
//#region app/feature/notifications/components/NotificationsList.tsx
var NotificationsList = ({ notifications }) => {
	return /* @__PURE__ */ jsx("div", { children: notifications.map((notification) => /* @__PURE__ */ jsx(NotificationItem, { notification }, notification.id)) });
};
//#endregion
//#region app/feature/notifications/Screens/NotificationsScreen.tsx
var dummyNotifications = [
	{
		id: "1",
		userId: "user-123",
		type: "case_update",
		channel: "in_app",
		title: "Case Update",
		message: "Your case #12345 has been updated with new information from the court.",
		status: "read",
		templateKey: "case_update",
		correlationId: "correlation-123",
		metadata: { caseId: "12345" },
		scheduledAt: "2023-03-23T10:00:00Z",
		sentAt: "2023-03-23T10:01:00Z",
		createdAt: "2023-03-23T09:59:00Z",
		updatedAt: "2023-03-23T10:02:00Z"
	},
	{
		id: "2",
		userId: "user-123",
		type: "appointment_reminder",
		channel: "push",
		title: "Appointment Reminder",
		message: "You have a scheduled appointment with your lawyer tomorrow at 2:00 PM.",
		status: "sent",
		templateKey: "appointment_reminder",
		correlationId: "correlation-124",
		metadata: {
			appointmentId: "67890",
			time: "2023-03-24T14:00:00Z"
		},
		scheduledAt: "2023-03-23T08:00:00Z",
		sentAt: "2023-03-23T08:01:00Z",
		createdAt: "2023-03-23T07:59:00Z",
		updatedAt: "2023-03-23T08:01:00Z"
	},
	{
		id: "3",
		userId: "user-123",
		type: "document_ready",
		channel: "email",
		title: "Document Ready",
		message: "Your requested legal document has been prepared and is ready for review.",
		status: "delivered",
		templateKey: "document_ready",
		correlationId: "correlation-125",
		metadata: {
			documentId: "doc-456",
			documentType: "contract"
		},
		scheduledAt: "2023-03-22T16:00:00Z",
		sentAt: "2023-03-22T16:01:00Z",
		createdAt: "2023-03-22T15:59:00Z",
		updatedAt: "2023-03-22T16:02:00Z"
	}
];
var NotificationsScreen = ({ notifications }) => {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", { children: "Notifications" }), /* @__PURE__ */ jsx(NotificationsList, { notifications: notifications || dummyNotifications })] });
};
//#endregion
//#region app/lib/api/notifications.api.ts
var NotificationsApiClient = class {
	api;
	constructor() {
		this.api = new FetchApiClient();
	}
	async getNotifications(options = { headers: {} }) {
		try {
			const response = await this.api.request("/v1/notifications/", { headers: options.headers });
			if (!response.data) {
				console.error("Invalid notifications data:", response);
				throw new Error("Invalid notifications data received from the server");
			}
			return response.data.map((notification) => notification.attributes);
		} catch (error) {
			console.error("Failed to fetch notifications:", error);
			throw error;
		}
	}
};
var notificationsApi = new NotificationsApiClient();
//#endregion
//#region app/feature/notifications/hooks/use-notifications.ts
var notificationsKeys = {
	all: ["notifications"],
	notifications: () => [...notificationsKeys.all, "notifications"],
	notification: (id) => [
		...notificationsKeys.all,
		"notification",
		id
	]
};
function useNotifications() {
	return useQuery({
		queryKey: notificationsKeys.notifications(),
		queryFn: async () => {
			return await notificationsApi.getNotifications();
		},
		meta: {
			errorToast: true,
			errorMessage: "Failed to load notifications"
		}
	});
}
//#endregion
//#region app/routes/notifications/index.tsx
var notifications_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$15,
	default: () => notifications_default,
	loader: () => loader$7,
	meta: () => meta$15
});
function meta$15({}) {
	return [{ title: "Notifications" }];
}
async function loader$7({ context }) {
	const token = context.get(authContext)?.token;
	return { notifications: await notificationsApi.getNotifications({ headers: { Authorization: `Bearer ${token}` } }) };
}
var notifications_default = UNSAFE_withComponentProps(function NotificationsRoute() {
	const { data: notifications, isLoading, error } = useNotifications();
	return /* @__PURE__ */ jsx(NotificationsScreen, { notifications });
});
var ErrorBoundary$15 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/components/ui/label.tsx
function Label({ className, ...props }) {
	return /* @__PURE__ */ jsx(LabelPrimitive.Root, {
		"data-slot": "label",
		className: cn("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
		...props
	});
}
//#endregion
//#region app/feature/auth/components/social-auth-buttons.tsx
var AuthSocialButtons = () => {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative",
			children: [/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 flex items-center",
				children: /* @__PURE__ */ jsx("div", { className: "w-full border-t-2 border-gray-900" })
			}), /* @__PURE__ */ jsx("div", {
				className: "relative flex justify-center",
				children: /* @__PURE__ */ jsx("span", {
					className: "px-3 bg-white text-sm font-bold text-gray-600",
					children: "Or continue with"
				})
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-2 gap-4",
			children: [/* @__PURE__ */ jsx(Button, {
				variant: "outline",
				type: "button",
				className: "border-2 border-gray-900 bg-white hover:bg-gray-50 font-bold",
				style: {
					boxShadow: "2px 2px 0 0 #000",
					borderRadius: "4px 8px 4px 8px"
				},
				children: /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5" })
			}), /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				type: "button",
				className: "border-2 border-gray-900 bg-white hover:bg-gray-50 font-bold",
				style: {
					boxShadow: "2px 2px 0 0 #000",
					borderRadius: "4px 8px 4px 8px"
				},
				children: /* @__PURE__ */ jsx(Facebook, { className: "h-5 w-5" })
			})]
		})]
	});
};
//#endregion
//#region app/components/ui/form.tsx
var Form = FormProvider;
var FormFieldContext = React$1.createContext({});
var FormField = ({ ...props }) => {
	return /* @__PURE__ */ jsx(FormFieldContext.Provider, {
		value: { name: props.name },
		children: /* @__PURE__ */ jsx(Controller, { ...props })
	});
};
var useFormField = () => {
	const fieldContext = React$1.useContext(FormFieldContext);
	const itemContext = React$1.useContext(FormItemContext);
	const { getFieldState } = useFormContext();
	const formState = useFormState({ name: fieldContext.name });
	const fieldState = getFieldState(fieldContext.name, formState);
	if (!fieldContext) throw new Error("useFormField should be used within <FormField>");
	const { id } = itemContext;
	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState
	};
};
var FormItemContext = React$1.createContext({});
function FormItem({ className, ...props }) {
	const id = React$1.useId();
	return /* @__PURE__ */ jsx(FormItemContext.Provider, {
		value: { id },
		children: /* @__PURE__ */ jsx("div", {
			"data-slot": "form-item",
			className: cn("grid gap-2", className),
			...props
		})
	});
}
function FormLabel({ className, ...props }) {
	const { error, formItemId } = useFormField();
	return /* @__PURE__ */ jsx(Label, {
		"data-slot": "form-label",
		"data-error": !!error,
		className: cn("data-[error=true]:text-destructive", className),
		htmlFor: formItemId,
		...props
	});
}
function FormControl({ ...props }) {
	const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
	return /* @__PURE__ */ jsx(Slot, {
		"data-slot": "form-control",
		id: formItemId,
		"aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
		"aria-invalid": !!error,
		...props
	});
}
function FormMessage({ className, ...props }) {
	const { error, formMessageId } = useFormField();
	const body = error ? String(error?.message ?? "") : props.children;
	if (!body) return null;
	return /* @__PURE__ */ jsx("p", {
		"data-slot": "form-message",
		id: formMessageId,
		className: cn("text-destructive text-sm", className),
		...props,
		children: body
	});
}
//#endregion
//#region app/feature/auth/components/auth-form.tsx
schemas.postV1login_Body;
var AuthForm = ({ mode = "login", handleSubmit, isLoading, error, register, errors }) => {
	const isSignup = mode === "signup";
	return /* @__PURE__ */ jsxs(CardWithLabel, {
		label: isSignup ? "Sign Up" : "Login",
		labelClassName: "bg-yellow-100 text-yellow-800 font-bold",
		className: "space-y-4 border-solid",
		children: [/* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "space-y-4",
			children: [
				error && /* @__PURE__ */ jsx("div", {
					className: "p-3 bg-red-50 border-2 border-red-900 rounded text-red-900 text-sm font-medium",
					children: error
				}),
				isSignup && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: "name",
					className: "block text-sm font-bold text-gray-700 mb-2",
					children: "Full name"
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
							children: /* @__PURE__ */ jsx(User, { className: "h-5 w-5 text-gray-400" })
						}),
						/* @__PURE__ */ jsx(Input, {
							id: "name",
							...register("name"),
							type: "text",
							autoComplete: "name",
							disabled: isLoading,
							className: "pl-12 w-full border-2 border-gray-900 font-medium",
							style: {
								boxShadow: "2px 2px 0 0 #000",
								borderRadius: "4px 8px 4px 8px"
							},
							placeholder: "John Doe"
						}),
						errors.name && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-red-600 font-medium",
							children: errors.name.message
						})
					]
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: "email",
					className: "block text-sm font-bold text-gray-700 mb-2",
					children: "Email address"
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
							children: /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5 text-gray-400" })
						}),
						/* @__PURE__ */ jsx(Input, {
							id: "email",
							...register("email"),
							type: "email",
							autoComplete: "email",
							disabled: isLoading,
							className: "pl-12 w-full border-2 border-gray-900 font-medium",
							style: {
								boxShadow: "2px 2px 0 0 #000",
								borderRadius: "4px 8px 4px 8px"
							},
							placeholder: "you@example.com"
						}),
						errors.email && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-red-600 font-medium",
							children: errors.email.message
						})
					]
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-2",
					children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "password",
						className: "block text-sm font-bold text-gray-700",
						children: "Password"
					}), !isSignup && /* @__PURE__ */ jsx(NavLink, {
						to: "/forgot-password",
						className: "text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors",
						children: "Forgot Password?"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
							children: /* @__PURE__ */ jsx(Lock, { className: "h-5 w-5 text-gray-400" })
						}),
						/* @__PURE__ */ jsx(Input, {
							id: "password",
							...register("password"),
							type: "password",
							autoComplete: isSignup ? "new-password" : "current-password",
							disabled: isLoading,
							className: "pl-12 w-full border-2 border-gray-900 font-medium",
							style: {
								boxShadow: "2px 2px 0 0 #000",
								borderRadius: "4px 8px 4px 8px"
							},
							placeholder: "••••••••"
						}),
						errors.password && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-red-600 font-medium",
							children: errors.password.message
						})
					]
				})] }),
				/* @__PURE__ */ jsx(Button, {
					type: "submit",
					disabled: isLoading,
					className: "w-full border-2 border-gray-900 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black text-base py-3 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed",
					style: {
						boxShadow: "3px 3px 0 0 #000",
						borderRadius: "4px 12px 4px 12px"
					},
					children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), isSignup ? "Creating account..." : "Signing in..."] }) : isSignup ? "Sign Up" : "Sign In"
				})
			]
		}), /* @__PURE__ */ jsx(AuthSocialButtons, {})]
	});
};
//#endregion
//#region app/feature/auth/components/auth-alternative.tsx
var AuthAlternative = ({ to, text, message }) => {
	return /* @__PURE__ */ jsxs("p", {
		className: "mt-8 text-center text-gray-600 font-medium",
		children: [
			message,
			" ",
			/* @__PURE__ */ jsx(NavLink, {
				to,
				className: "font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors",
				children: text
			})
		]
	});
};
//#endregion
//#region app/feature/auth/screens/LoginScreen.tsx
var loginRequestSchema = schemas.postV1login_Body;
var LoginScreen = () => {
	const navigate = useNavigate();
	const { t } = useTranslation("auth");
	const loginMutation = useLogin();
	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(loginRequestSchema) });
	const onSubmit = (data) => {
		loginMutation.mutate(data, {
			onSuccess: () => {
				navigate("/");
			},
			onError: () => {
				toast.error(t("login.error"));
			}
		});
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(AuthForm, {
		mode: "login",
		handleSubmit: handleSubmit(onSubmit),
		isLoading: isSubmitting || loginMutation.isPending,
		error: loginMutation.error ? t("login.invalidCredentials") : null,
		register,
		errors
	}), /* @__PURE__ */ jsx(AuthAlternative, {
		to: "/signup",
		text: t("login.signUpLink"),
		message: t("login.signUpMessage")
	})] });
};
//#endregion
//#region app/routes/auth/login.tsx
var login_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$14,
	default: () => login_default,
	meta: () => meta$14
});
function meta$14({}) {
	return [{ title: "Login - Mahakama" }, {
		name: "description",
		content: "Sign in to your Mahakama account to access your legal resources and history."
	}];
}
var login_default = UNSAFE_withComponentProps(LoginScreen);
var ErrorBoundary$14 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/feature/auth/screens/SignupScreen.tsx
var registerRequestSchema = schemas.postV1register_Body;
var SignupScreen = () => {
	const navigate = useNavigate();
	const { t } = useTranslation("auth");
	const registerMutation = useRegister();
	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(registerRequestSchema) });
	const onSubmit = (data) => {
		registerMutation.mutate(data, {
			onSuccess: () => {
				navigate("/");
			},
			onError: () => {
				toast.error(t("signup.error"));
			}
		});
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(AuthForm, {
		mode: "signup",
		handleSubmit: handleSubmit(onSubmit),
		isLoading: isSubmitting || registerMutation.isPending,
		error: registerMutation.error ? t("signup.invalidCredentials") : null,
		register,
		errors
	}), /* @__PURE__ */ jsx(AuthAlternative, {
		to: "/login",
		text: t("signup.loginLink"),
		message: t("signup.loginMessage")
	})] });
};
//#endregion
//#region app/routes/auth/signup.tsx
var signup_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$13,
	default: () => signup_default,
	meta: () => meta$13
});
function meta$13({}) {
	return [{ title: "Signup - Mahakama" }, {
		name: "description",
		content: "Sign up to your Mahakama account to access your legal resources and history."
	}];
}
var signup_default = UNSAFE_withComponentProps(SignupScreen);
var ErrorBoundary$13 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/feature/auth/screens/ForgotPassword.tsx
var RecoveryForm = ({ email, setEmail, onSubmit }) => {
	const { t } = useTranslation("auth");
	return /* @__PURE__ */ jsx(CardWithLabel, {
		label: t("forgotPassword.label"),
		className: "bg-white",
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit,
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "space-y-2",
					children: /* @__PURE__ */ jsx("p", {
						className: "text-sm font-bold italic",
						children: t("forgotPassword.instruction")
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ jsxs("label", {
						className: "text-xs font-black uppercase tracking-widest flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsx(Mail, { size: 14 }),
							" ",
							t("forgotPassword.emailLabel")
						]
					}), /* @__PURE__ */ jsx("input", {
						type: "email",
						required: true,
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: t("forgotPassword.emailPlaceholder"),
						className: "w-full p-4 border-4 border-black focus:outline-none focus:bg-yellow-50 font-bold transition-colors"
					})]
				}),
				/* @__PURE__ */ jsx("button", {
					type: "submit",
					className: "w-full bg-yellow-400 text-black font-black py-4 border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase italic",
					children: t("forgotPassword.submitButton")
				}),
				/* @__PURE__ */ jsx("div", {
					className: "text-center pt-2",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/login",
						className: "text-xs font-black uppercase underline decoration-2 hover:text-yellow-600 flex items-center justify-center gap-2",
						children: [
							/* @__PURE__ */ jsx(ArrowLeft, { size: 14 }),
							" ",
							t("forgotPassword.backToLogin")
						]
					})
				})
			]
		})
	});
};
var SuccessState = ({ email, onReset }) => {
	const { t } = useTranslation("auth");
	return /* @__PURE__ */ jsx(CardWithLabel, {
		label: t("forgotPassword.successLabel"),
		className: "bg-green-50 border-green-500",
		children: /* @__PURE__ */ jsxs("div", {
			className: "py-6 text-center space-y-4",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "inline-flex items-center justify-center w-16 h-16 bg-green-100 border-4 border-green-500 rounded-full mb-2 text-green-600",
					children: /* @__PURE__ */ jsx(ShieldCheck, { size: 32 })
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "font-bold italic",
					children: [
						t("forgotPassword.successMessage"),
						" ",
						/* @__PURE__ */ jsx("span", {
							className: "underline",
							children: email
						}),
						"."
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-sm text-zinc-600 font-medium",
					children: t("forgotPassword.spamNotice")
				}),
				/* @__PURE__ */ jsx("button", {
					onClick: onReset,
					className: "w-full mt-4 bg-black text-white font-black py-3 border-2 border-black hover:bg-zinc-800 transition-all uppercase text-xs",
					children: t("forgotPassword.tryDifferentEmail")
				})
			]
		})
	});
};
var ForgotPasswordScreen = () => {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [email, setEmail] = useState("");
	const handleSubmit = (e) => {
		e.preventDefault();
		setIsSubmitted(true);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "flex flex-col items-center justify-center p-6",
		children: /* @__PURE__ */ jsx("div", {
			className: "w-full max-w-md",
			children: !isSubmitted ? /* @__PURE__ */ jsx(RecoveryForm, {
				email,
				setEmail,
				onSubmit: handleSubmit
			}) : /* @__PURE__ */ jsx(SuccessState, {
				email,
				onReset: () => setIsSubmitted(false)
			})
		})
	});
};
//#endregion
//#region app/routes/auth/forgot-password.tsx
var forgot_password_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$12,
	default: () => forgot_password_default,
	meta: () => meta$12
});
function meta$12({}) {
	return [{ title: "Forgot Password - Mahakama" }, {
		name: "description",
		content: "Forgot your password? No problem! Enter your email address and we'll send you a link to reset your password."
	}];
}
var forgot_password_default = UNSAFE_withComponentProps(ForgotPasswordScreen);
var ErrorBoundary$12 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/routes/chats/chats.new.tsx
var chats_new_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$11,
	action: () => action,
	default: () => chats_new_default,
	meta: () => meta$11
});
function meta$11({}) {
	return [{ title: "Start New Chat - Mahakama" }, {
		name: "description",
		content: "Ask a legal question and get guidance from Mahakama's AI legal assistant."
	}];
}
async function action({ request }) {
	const token = parseCookies(request.headers.get("Cookie")).token;
	const question = (await request.formData()).get("question");
	if (!question) return { error: "Question is required" };
	try {
		const chat = await chatApi.createChat({ message: question }, { headers: { Authorization: `Bearer ${token}` } });
		return new Response(null, {
			status: 302,
			headers: { Location: `/chat/${chat.id}` }
		});
	} catch (error) {
		console.error("Error creating chat:", error);
		return { error: "Failed to create chat. Please try again." };
	}
}
var chats_new_default = UNSAFE_withComponentProps(function NewChat() {
	return /* @__PURE__ */ jsx(NewChatScreen, {});
});
var ErrorBoundary$11 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/components/ui/alert-dialog.tsx
function AlertDialog({ ...props }) {
	return /* @__PURE__ */ jsx(AlertDialogPrimitive.Root, {
		"data-slot": "alert-dialog",
		...props
	});
}
function AlertDialogTrigger({ ...props }) {
	return /* @__PURE__ */ jsx(AlertDialogPrimitive.Trigger, {
		"data-slot": "alert-dialog-trigger",
		...props
	});
}
function AlertDialogPortal({ ...props }) {
	return /* @__PURE__ */ jsx(AlertDialogPrimitive.Portal, {
		"data-slot": "alert-dialog-portal",
		...props
	});
}
function AlertDialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ jsx(AlertDialogPrimitive.Overlay, {
		"data-slot": "alert-dialog-overlay",
		className: cn("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className),
		...props
	});
}
function AlertDialogContent({ className, ...props }) {
	return /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [/* @__PURE__ */ jsx(AlertDialogOverlay, {}), /* @__PURE__ */ jsx(AlertDialogPrimitive.Content, {
		"data-slot": "alert-dialog-content",
		className: cn("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", className),
		...props
	})] });
}
function AlertDialogHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "alert-dialog-header",
		className: cn("flex flex-col gap-2 text-center sm:text-left", className),
		...props
	});
}
function AlertDialogFooter({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "alert-dialog-footer",
		className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
function AlertDialogTitle({ className, ...props }) {
	return /* @__PURE__ */ jsx(AlertDialogPrimitive.Title, {
		"data-slot": "alert-dialog-title",
		className: cn("text-lg font-semibold", className),
		...props
	});
}
function AlertDialogDescription({ className, ...props }) {
	return /* @__PURE__ */ jsx(AlertDialogPrimitive.Description, {
		"data-slot": "alert-dialog-description",
		className: cn("text-muted-foreground text-sm", className),
		...props
	});
}
function AlertDialogAction({ className, ...props }) {
	return /* @__PURE__ */ jsx(AlertDialogPrimitive.Action, {
		className: cn(buttonVariants(), className),
		...props
	});
}
function AlertDialogCancel({ className, ...props }) {
	return /* @__PURE__ */ jsx(AlertDialogPrimitive.Cancel, {
		className: cn(buttonVariants({ variant: "outline" }), className),
		...props
	});
}
//#endregion
//#region app/feature/chats/components/ChatHeader.tsx
function ChatListHeader({ title = "Recent Chats" }) {
	return /* @__PURE__ */ jsx("div", {
		className: "sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b",
		children: /* @__PURE__ */ jsxs("div", {
			className: "py-3 px-4 flex items-center justify-between",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-xl font-normal text-foreground",
				children: title
			}), /* @__PURE__ */ jsx(Button, {
				asChild: true,
				variant: "outline",
				size: "sm",
				className: "gap-2 border-2 border-black rounded-lg text-gray-900 bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px]",
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/",
					viewTransition: true,
					children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), "New Chat"]
				})
			})]
		})
	});
}
function ActiveChatHeader({ title, onDeleteChat, onRenameChat, onShareChat }) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "py-3 px-4 flex items-center justify-between",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-xl font-normal text-foreground truncate mr-2",
				children: title
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsxs(Button, {
					onClick: onShareChat,
					variant: "outline",
					size: "sm",
					className: "gap-2 border-2 border-black rounded-lg text-gray-900 bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000]",
					children: [/* @__PURE__ */ jsx(Share2, { className: "h-4 w-4" }), "Share"]
				}), /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ jsx(Button, {
						variant: "outline",
						size: "sm",
						className: "border-2 border-black rounded-lg text-gray-900 bg-white shadow-[3px_3px_0_0_#000] hover:bg-white hover:shadow-[2px_2px_0_0_#000]",
						children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" })
					})
				}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
					className: "w-40 border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-lg",
					align: "end",
					children: [/* @__PURE__ */ jsxs(DropdownMenuItem, {
						onClick: onRenameChat,
						className: "cursor-pointer",
						children: [/* @__PURE__ */ jsx(Edit, { className: "h-4 w-4 mr-2" }), " Rename"]
					}), /* @__PURE__ */ jsxs(DropdownMenuItem, {
						onClick: () => setShowDeleteDialog(true),
						className: "text-red-600 cursor-pointer",
						children: [/* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 mr-2" }), " Delete"]
					})]
				})] })]
			})]
		}), /* @__PURE__ */ jsx(AlertDialog, {
			open: showDeleteDialog,
			onOpenChange: setShowDeleteDialog,
			children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete Chat" }), /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Are you sure you want to delete this chat? This action cannot be undone." })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ jsx(AlertDialogAction, {
				className: "bg-red-600 hover:bg-red-700",
				onClick: () => {
					onDeleteChat?.();
					setShowDeleteDialog(false);
				},
				children: "Delete"
			})] })] })
		})]
	});
}
//#endregion
//#region app/feature/chats/components/ChatItem.tsx
var formatDate = (dateString) => {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	}).format(date);
};
function ChatItem({ chat, onRename, onDelete }) {
	useNavigate();
	return /* @__PURE__ */ jsx("div", {
		className: "group relative",
		children: /* @__PURE__ */ jsx("div", {
			className: "bg-white p-3 sm:p-4 transition-all duration-200 border border-border hover:shadow-[0px_6px_24px_0px_hsl(var(--shadow-hover)),0px_0px_0px_1px_hsl(var(--shadow-border))] shadow-[3px_3px_0_0_hsl(var(--shadow-color))]",
			style: { borderRadius: "var(--border-radius-chat)" },
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2",
				children: [/* @__PURE__ */ jsx(NavLink, {
					to: `/chats/${chat.id}`,
					className: ({ isActive }) => `flex-1 min-w-0 cursor-pointer ${isActive ? "ring-2 ring-yellow-400" : ""}`,
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center space-x-2 sm:space-x-3",
						children: [/* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-primary rounded-full flex-shrink-0" }), /* @__PURE__ */ jsx("h3", {
							className: "text-base sm:text-lg font-medium text-gray-900 truncate",
							children: chat.title || "Legal Consultation"
						})]
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between sm:items-center space-x-2 sm:space-x-3",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs text-gray-400 whitespace-nowrap font-mono",
						children: formatDate(chat?.updatedAt)
					}), /* @__PURE__ */ jsxs(DropdownMenuPrimitive.Root, { children: [/* @__PURE__ */ jsx(DropdownMenuPrimitive.Trigger, {
						asChild: true,
						children: /* @__PURE__ */ jsx("button", {
							className: "p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors",
							onClick: (e) => e.stopPropagation(),
							children: /* @__PURE__ */ jsx(MoreVertical, { className: "w-4 h-4" })
						})
					}), /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsxs(DropdownMenuPrimitive.Content, {
						className: "min-w-[180px] bg-white rounded-md shadow-lg border border-gray-200 p-1 z-50",
						align: "end",
						sideOffset: 5,
						children: [
							/* @__PURE__ */ jsxs(DropdownMenuPrimitive.Item, {
								className: "flex items-center px-3 py-2 text-sm text-gray-700 rounded cursor-pointer hover:bg-gray-100 outline-none",
								onClick: (e) => {
									e.stopPropagation();
									const newTitle = prompt("Enter new chat title:", chat.title || "Legal Consultation");
									if (newTitle && newTitle !== chat.title) onRename(newTitle);
								},
								children: [/* @__PURE__ */ jsx("span", {
									className: "mr-2",
									children: "✏️"
								}), "Rename"]
							}),
							/* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, { className: "h-px bg-gray-200 m-1" }),
							/* @__PURE__ */ jsxs(AlertDialog, { children: [/* @__PURE__ */ jsx(AlertDialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center px-3 py-2 text-sm text-red-600 rounded cursor-pointer hover:bg-red-50 outline-none",
									children: [/* @__PURE__ */ jsx("span", {
										className: "mr-2",
										children: "🗑️"
									}), "Delete"]
								})
							}), /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete this chat?" }), /* @__PURE__ */ jsx(AlertDialogDescription, { children: "This action cannot be undone. This will permanently delete the chat and all its messages." })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, {
								onClick: (e) => e.stopPropagation(),
								children: "Cancel"
							}), /* @__PURE__ */ jsx(AlertDialogAction, {
								className: "bg-red-600 hover:bg-red-700",
								onClick: (e) => {
									e.stopPropagation();
									onDelete();
								},
								children: "Delete"
							})] })] })] })
						]
					}) })] })]
				})]
			})
		})
	});
}
//#endregion
//#region app/feature/chats/components/ChatList.tsx
function ChatList({ chats, error, onRename, onDelete, onRetry }) {
	if (error) return /* @__PURE__ */ jsx(ErrorState, {
		error,
		onRetry
	});
	if (chats.length === 0) return /* @__PURE__ */ jsx(EmptyState, {
		title: "No recent chats",
		description: "Your chat history will appear here",
		actions: [{
			label: "Start a New Chat",
			href: "/chats/new",
			variant: "default"
		}]
	});
	return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", {
		className: "space-y-3 sm:space-y-4",
		children: chats.map((chat) => /* @__PURE__ */ jsx(ChatItem, {
			chat,
			onRename: (newTitle) => onRename(chat?.id, newTitle),
			onDelete: () => onDelete(chat?.id)
		}, chat.id))
	}) });
}
//#endregion
//#region app/feature/chats/screens/RecentChatsScreen.tsx
var RecentChatsScreen = ({ chats, error }) => {
	const deleteChat = useDeleteChat();
	const updateChatTitle = useUpdateChatTitle();
	const handleDeleteChat = (chatId) => {
		deleteChat.mutate(chatId);
	};
	const handleRenameChat = (chatId, newTitle) => {
		updateChatTitle.mutate({
			chatId,
			newTitle
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ jsx(ChatListHeader, { title: "Recent Chats" }), /* @__PURE__ */ jsx(ChatList, {
			chats,
			error,
			onRename: handleRenameChat,
			onDelete: handleDeleteChat
		})]
	});
};
//#endregion
//#region app/routes/chats/chats.recents.tsx
var chats_recents_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$10,
	default: () => chats_recents_default,
	loader: () => loader$6,
	meta: () => meta$10
});
function meta$10() {
	return [{ title: "Recent Chats - Mahakama" }, {
		name: "description",
		content: "View your recent legal consultations and chat history on Mahakama"
	}];
}
async function loader$6({ request }) {
	try {
		const token = parseCookies(request.headers.get("Cookie")).token;
		return {
			chats: await chatApi.getChats({ headers: { Authorization: `Bearer ${token}` } }),
			error: null
		};
	} catch (error) {
		handleRouteError(error);
	}
}
var chats_recents_default = UNSAFE_withComponentProps(function RecentChats({ loaderData }) {
	const { chats, error } = loaderData;
	return /* @__PURE__ */ jsx(RecentChatsScreen, {
		chats,
		error
	});
});
var ErrorBoundary$10 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/feature/chats/components/AnswerDisclaimer.tsx
var AnswerDisclaimer = () => {
	return /* @__PURE__ */ jsx(CardWithLabel, {
		label: "Legal Notice",
		className: "border-yellow-400 bg-yellow-50 p-4 rounded-none border-l-4",
		labelClassName: "text-yellow-600",
		children: /* @__PURE__ */ jsxs("p", {
			className: "text-xs text-gray-600 leading-relaxed",
			children: [/* @__PURE__ */ jsx("strong", {
				className: "text-gray-900",
				children: "Disclaimer:"
			}), " This information is for educational purposes only and does not constitute legal advice. For specific legal guidance, please consult with a qualified lawyer in your jurisdiction."]
		})
	});
};
//#endregion
//#region app/feature/chats/components/chat-input.tsx
function ChatInput({ value, onChange, onSubmit, placeholder = "Type your message...", className, disabled = false, isLoading = false }) {
	const [voiceEnabled, setVoiceEnabled] = useState(false);
	const inputRef = useRef(null);
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.style.height = "auto";
			inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
		}
	}, [value]);
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (!voiceEnabled) onSubmit();
		}
	};
	const handleVoiceToggle = () => {
		setVoiceEnabled(!voiceEnabled);
	};
	return /* @__PURE__ */ jsx("div", {
		className: cn("w-full", className),
		children: /* @__PURE__ */ jsxs(ButtonGroup, {
			className: "[--radius:9999rem] w-full",
			children: [
				/* @__PURE__ */ jsx(ButtonGroup, {
					className: "shrink-0",
					children: /* @__PURE__ */ jsx(Button, {
						variant: "outline",
						size: "icon",
						className: "rounded-full",
						children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" })
					})
				}),
				/* @__PURE__ */ jsx(ButtonGroup, {
					className: "flex-1",
					children: /* @__PURE__ */ jsxs(InputGroup, {
						className: "w-full",
						children: [/* @__PURE__ */ jsx(InputGroupInput, {
							ref: inputRef,
							value: voiceEnabled ? "" : value,
							onChange: (e) => onChange(e.target.value),
							onKeyDown: handleKeyDown,
							placeholder: voiceEnabled ? "Record and send audio..." : placeholder,
							disabled: disabled || isLoading || voiceEnabled,
							className: "min-h-[44px] resize-none"
						}), /* @__PURE__ */ jsx(InputGroupAddon, {
							align: "inline-end",
							children: /* @__PURE__ */ jsxs(Tooltip, { children: [/* @__PURE__ */ jsx(TooltipTrigger, {
								asChild: true,
								children: /* @__PURE__ */ jsx(InputGroupButton, {
									onClick: handleVoiceToggle,
									size: "icon-xs",
									"data-active": voiceEnabled,
									className: cn("data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700", "dark:data-[active=true]:bg-orange-800 dark:data-[active=true]:text-orange-100"),
									"aria-pressed": voiceEnabled,
									disabled: disabled || isLoading,
									children: /* @__PURE__ */ jsx(AudioLines, { className: "h-4 w-4" })
								})
							}), /* @__PURE__ */ jsx(TooltipContent, { children: "Voice Mode" })] })
						})]
					})
				}),
				!voiceEnabled && /* @__PURE__ */ jsx(ButtonGroup, {
					className: "shrink-0",
					children: /* @__PURE__ */ jsxs(Button, {
						onClick: onSubmit,
						disabled: disabled || isLoading || !value.trim(),
						size: "icon",
						className: "rounded-full",
						children: [/* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
							className: "sr-only",
							children: "Send message"
						})]
					})
				})
			]
		})
	});
}
//#endregion
//#region app/feature/chats/components/MessageMetadata.tsx
function MessageMetadata({ metadata }) {
	if (!metadata) return null;
	const isMissing = metadata.citationStatus === "missing";
	const hasStale = metadata.hasStaleSources;
	if (!isMissing && !hasStale) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-3 border-t border-gray-200 pt-2 space-y-2",
		children: [isMissing && /* @__PURE__ */ jsx("p", {
			className: "text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1",
			children: "No specific legal source was found for this answer — treat it as general information and verify with a lawyer."
		}), hasStale && /* @__PURE__ */ jsxs("div", {
			className: "text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1",
			children: [/* @__PURE__ */ jsx("p", {
				className: "font-semibold",
				children: "Some cited information may be out of date."
			}), metadata.sources?.filter((source) => source.stale).map((source, index) => /* @__PURE__ */ jsxs("p", {
				className: "mt-0.5",
				children: [
					source.fullCitation ?? source.title,
					source.lastUpdated && ` — based on text as of ${source.lastUpdated}`,
					". A more recent amendment may exist."
				]
			}, source.id ?? index))]
		})]
	});
}
//#endregion
//#region app/feature/chats/components/MessageBubble.tsx
function MessageBubble({ message, onRetry, isRetrying = false, showCitationRefs = false, onCitationClick }) {
	const isUser = isUserMessage(message);
	const isFailed = hasFailedReply(message) || isStalePendingReply(message);
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
		className: `flex ${isUser ? "justify-end" : "justify-start"}`,
		children: /* @__PURE__ */ jsxs("div", {
			className: `rounded-lg p-4 ${isUser ? "bg-white border-2 border-gray-900 text-gray-900" : "text-gray-900"}`,
			style: {
				boxShadow: isUser ? "2px 2px 0 0 #000" : "none",
				borderRadius: isUser ? "4px 8px 4px 8px" : "none",
				maxWidth: "calc(100% - 2rem)"
			},
			children: [
				isUser ? /* @__PURE__ */ jsx("p", {
					className: "text-sm leading-relaxed break-words",
					children: message.content
				}) : /* @__PURE__ */ jsx("div", {
					className: "text-sm leading-relaxed break-words",
					children: /* @__PURE__ */ jsx(ReactMarkdown, {
						remarkPlugins: [remarkGfm],
						components: {
							h1: ({ node, ...props }) => /* @__PURE__ */ jsx("h1", {
								className: "text-lg font-bold mt-4 mb-2 first:mt-0",
								...props
							}),
							h2: ({ node, ...props }) => /* @__PURE__ */ jsx("h2", {
								className: "text-base font-bold mt-3 mb-2 first:mt-0",
								...props
							}),
							h3: ({ node, ...props }) => /* @__PURE__ */ jsx("h3", {
								className: "text-sm font-semibold mt-3 mb-1 first:mt-0",
								...props
							}),
							p: ({ node, ...props }) => /* @__PURE__ */ jsx("p", {
								className: "mb-3 last:mb-0",
								...props
							}),
							ul: ({ node, ...props }) => /* @__PURE__ */ jsx("ul", {
								className: "list-disc pl-5 mb-3 space-y-1",
								...props
							}),
							ol: ({ node, ...props }) => /* @__PURE__ */ jsx("ol", {
								className: "list-decimal pl-5 mb-3 space-y-1",
								...props
							}),
							li: ({ node, ...props }) => /* @__PURE__ */ jsx("li", {
								className: "leading-relaxed",
								...props
							}),
							strong: ({ node, ...props }) => /* @__PURE__ */ jsx("strong", {
								className: "font-semibold",
								...props
							}),
							em: ({ node, ...props }) => /* @__PURE__ */ jsx("em", {
								className: "italic",
								...props
							}),
							a: ({ node, ...props }) => /* @__PURE__ */ jsx("a", {
								className: "text-blue-600 hover:underline",
								target: "_blank",
								rel: "noopener noreferrer",
								...props
							}),
							blockquote: ({ node, ...props }) => /* @__PURE__ */ jsx("blockquote", {
								className: "border-l-4 border-gray-300 pl-4 italic my-2",
								...props
							})
						},
						children: message.content
					})
				}),
				!isUser && showCitationRefs && message.metadata?.sources?.length && message.metadata.sources.length > 0 && /* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-1.5 mt-2 flex-wrap",
					"aria-label": "Citation references",
					children: message.metadata.sources.map((_, i) => /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => onCitationClick?.(i),
						className: "inline-flex items-center justify-center text-[10px] font-medium text-blue-600 hover:text-blue-800 hover:underline px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100",
						"aria-label": `View source ${i + 1}`,
						children: [
							"[",
							i + 1,
							"]"
						]
					}, i))
				}),
				!isUser && /* @__PURE__ */ jsx(MessageMetadata, { metadata: message.metadata }),
				/* @__PURE__ */ jsx("div", {
					className: "text-xs opacity-60 mt-2",
					children: new Date(message.timestamp).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit"
					})
				})
			]
		})
	}), isUser && isFailed && /* @__PURE__ */ jsx("div", {
		className: "flex justify-end mt-2",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-md px-3 py-2 text-xs max-w-[calc(100%-2rem)]",
			children: [/* @__PURE__ */ jsx("p", {
				className: "flex-1",
				children: "The assistant reply could not be generated."
			}), /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => onRetry?.(message.id),
				disabled: isRetrying,
				className: "inline-flex items-center gap-1 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed",
				children: [/* @__PURE__ */ jsx(RefreshCw, { className: `w-3 h-3 ${isRetrying ? "animate-spin" : ""}` }), isRetrying ? "Retrying..." : "Retry"]
			})]
		})
	})] });
}
//#endregion
//#region app/feature/chats/components/TypingIndicator.tsx
function TypingIndicator() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex justify-start",
		children: /* @__PURE__ */ jsxs("div", {
			className: "bg-gray-100 text-gray-900 rounded-lg p-4",
			style: {
				borderRadius: "4px 8px 4px 8px",
				maxWidth: "calc(100% - 2rem)"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 mb-2",
				children: [/* @__PURE__ */ jsx(Bot, { className: "w-4 h-4 mt-1 flex-shrink-0" }), /* @__PURE__ */ jsx("span", {
					className: "text-xs font-medium opacity-75",
					children: "Legal Assistant"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center space-x-1",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "w-2 h-2 rounded-full bg-gray-400 animate-bounce",
						style: { animationDelay: "0ms" }
					}),
					/* @__PURE__ */ jsx("div", {
						className: "w-2 h-2 rounded-full bg-gray-400 animate-bounce",
						style: { animationDelay: "150ms" }
					}),
					/* @__PURE__ */ jsx("div", {
						className: "w-2 h-2 rounded-full bg-gray-400 animate-bounce",
						style: { animationDelay: "300ms" }
					})
				]
			})]
		})
	});
}
//#endregion
//#region app/feature/chats/components/MessageList.tsx
function MessageList({ messages, isLoading, showTyping = false, onRetry, isRetrying = false, citationMessageId, onCitationClick }) {
	if (isLoading) return /* @__PURE__ */ jsx("div", {
		className: "flex items-center justify-center py-8",
		children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" })
	});
	if (!messages || messages.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "text-center py-8 text-gray-500",
		children: [/* @__PURE__ */ jsx(MessageCircle, { className: "w-12 h-12 mx-auto mb-4 text-gray-300" }), /* @__PURE__ */ jsx("p", { children: "No messages yet. Start the conversation!" })]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4 px-4",
		children: [messages.map((message) => /* @__PURE__ */ jsx(MessageBubble, {
			message,
			onRetry,
			isRetrying,
			showCitationRefs: message.id === citationMessageId,
			onCitationClick
		}, message.id)), showTyping && /* @__PURE__ */ jsx(TypingIndicator, {})]
	});
}
//#endregion
//#region app/feature/chats/components/CitationsSidebar.tsx
function CitationsSidebar({ sources, focusedCitation }) {
	return /* @__PURE__ */ jsxs("aside", {
		className: "w-80 flex-shrink-0 hidden lg:flex flex-col h-full bg-background border-l overflow-y-auto",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "p-4 border-b flex items-center justify-between sticky top-0 bg-background z-10",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(FileText, { className: "w-5 h-5 text-foreground" }), /* @__PURE__ */ jsx("h2", {
					className: "font-semibold text-sm text-foreground",
					children: "Source Citations"
				})]
			}), /* @__PURE__ */ jsx("span", {
				className: "text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium",
				children: sources.length
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "p-4 space-y-3",
			children: sources.length === 0 ? /* @__PURE__ */ jsx("div", {
				className: "text-center py-12 text-muted-foreground text-xs",
				children: /* @__PURE__ */ jsx("p", { children: "No citations available for the current context yet." })
			}) : sources.map((source, index) => {
				const isFocused = focusedCitation === index;
				return /* @__PURE__ */ jsxs("div", {
					id: `citation-${index + 1}`,
					className: `p-3 rounded-lg border bg-card text-card-foreground shadow-sm space-y-1.5 text-xs transition-all duration-200 ${isFocused ? "ring-2 ring-blue-400 bg-blue-50 border-blue-200" : ""}`,
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "flex items-center justify-between font-semibold",
							children: /* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-1.5 text-foreground",
								children: [/* @__PURE__ */ jsx("span", {
									className: "inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-[10px]",
									children: index + 1
								}), source.title || "Legal Reference"]
							})
						}),
						source.content ? /* @__PURE__ */ jsxs("p", {
							className: "text-muted-foreground line-clamp-4 italic",
							children: [
								"“",
								source.content,
								"”"
							]
						}) : /* @__PURE__ */ jsx("p", {
							className: "text-muted-foreground",
							children: source.fullCitation ?? "No detailed extract available."
						}),
						source.url && /* @__PURE__ */ jsxs("a", {
							href: source.url,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "flex items-center gap-1 text-blue-600 hover:underline block pt-1 font-medium",
							children: ["View Source Link", /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })]
						})
					]
				}, source.id ?? index);
			})
		})]
	});
}
//#endregion
//#region app/feature/chats/screens/ChatScreen.tsx
var sendMessageSchema = z.object({ content: z.string().min(1, "Message cannot be empty") });
var ChatScreen = ({ chat, isLoading, error, messages, messagesLoading }) => {
	const navigate = useNavigate();
	const sendMessageMutation = useSendMessage();
	const deleteChatMutation = useDeleteChat();
	const retryMessageMutation = useRetryMessage(chat?.id ?? "");
	const { handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
		resolver: zodResolver(sendMessageSchema),
		defaultValues: { content: "" }
	});
	const messageContent = watch("content");
	const lastAssistantMessage = [...messages || []].reverse().find((m) => m.senderType === "assistant" || !m.senderType || m.metadata?.sources?.length);
	const activeSources = lastAssistantMessage?.metadata?.sources || [];
	const handleRenameChat = () => {
		const newTitle = window.prompt("Enter new chat title:", chat?.title || "");
		if (newTitle && newTitle.trim() && newTitle !== chat?.title) {}
	};
	const handleDeleteChat = () => {
		if (!chat) return;
		deleteChatMutation.mutate(chat.id, { onSuccess: () => {
			navigate("/chats/recents");
		} });
	};
	const handleShareChat = () => {
		if (!chat) return;
		const shareUrl = `${window.location.origin}/chats/${chat.id}`;
		if (navigator.share) navigator.share({
			title: chat.title || "Legal Consultation",
			text: "Check out this legal consultation",
			url: shareUrl
		});
		else {
			navigator.clipboard.writeText(shareUrl);
			alert("Chat link copied to clipboard!");
		}
	};
	const onSubmit = (data) => {
		if (!chat) return;
		const payload = {
			chatId: chat.id,
			content: data.content,
			senderType: "user",
			userId: chat.userId
		};
		sendMessageMutation.mutate(payload, { onSuccess: () => {
			reset();
		} });
	};
	const lastMessage = messages?.[messages.length - 1];
	const isReplyPending = lastMessage ? isReplyAwaiting(lastMessage) : false;
	const showTyping = sendMessageMutation.isPending || isReplyPending;
	const [focusedCitation, setFocusedCitation] = useState(null);
	const handleCitationClick = (index) => {
		document.getElementById(`citation-${index + 1}`)?.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
		setFocusedCitation(index);
		setTimeout(() => setFocusedCitation(null), 1500);
	};
	const citationMessageId = lastAssistantMessage?.id ?? null;
	if (isLoading) return /* @__PURE__ */ jsx(PageDetailsLoading, {
		title: "Loading Chat",
		description: "Please wait while we load your conversation..."
	});
	if (error) return /* @__PURE__ */ jsx(PageDetailsError, {
		error: "Failed to load chat",
		title: "Error Loading Chat",
		description: "We couldn't load your conversation. Please try again."
	});
	if (!chat) return /* @__PURE__ */ jsx(PageDetailsError, {
		error: "Chat not found",
		title: "Chat Not Found",
		description: "The conversation you're looking for doesn't exist or has been removed."
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-1 min-h-0 w-full overflow-hidden bg-background",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-col flex-1 min-h-0 border-r",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex-shrink-0 sticky top-0 z-10",
					children: /* @__PURE__ */ jsx(ActiveChatHeader, {
						title: chat.title,
						onDeleteChat: handleDeleteChat,
						onRenameChat: handleRenameChat,
						onShareChat: handleShareChat
					})
				}),
				/* @__PURE__ */ jsx(AnswerDisclaimer, { className: "flex-shrink-0" }),
				/* @__PURE__ */ jsx("div", {
					className: "flex-1 min-h-0 overflow-y-auto p-4 pb-8",
					children: /* @__PURE__ */ jsx(MessageList, {
						messages: messages || [],
						isLoading: messagesLoading,
						showTyping,
						onRetry: (messageId) => retryMessageMutation.mutate(messageId),
						isRetrying: retryMessageMutation.isPending,
						citationMessageId,
						onCitationClick: handleCitationClick
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex-shrink-0 sticky bottom-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4",
					children: /* @__PURE__ */ jsx("div", {
						className: "max-w-4xl mx-auto w-full",
						children: /* @__PURE__ */ jsxs("form", {
							onSubmit: handleSubmit(onSubmit),
							children: [/* @__PURE__ */ jsx(ChatInput, {
								value: messageContent || "",
								onChange: (value) => setValue("content", value),
								onSubmit: () => handleSubmit(onSubmit)(),
								placeholder: "Ask a legal question or paste a clause to analyze...",
								isLoading: isSubmitting || sendMessageMutation.isPending,
								disabled: isSubmitting || sendMessageMutation.isPending
							}), errors.content && /* @__PURE__ */ jsx("p", {
								className: "text-red-500 text-sm mt-2",
								children: errors.content.message
							})]
						})
					})
				})
			]
		}), /* @__PURE__ */ jsx(CitationsSidebar, {
			sources: activeSources,
			focusedCitation
		})]
	});
};
//#endregion
//#region app/routes/chats/$chatId.tsx
var $chatId_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$9,
	default: () => $chatId_default,
	meta: () => meta$9
});
function meta$9({}) {
	return [{ title: "Chat - Mahakama" }, {
		name: "description",
		content: "View your legal answer"
	}];
}
var $chatId_default = UNSAFE_withComponentProps(function ChatDetailsPage({ params }) {
	const { chatId } = params;
	const { data: chat, isLoading, error } = useChat(chatId);
	const { data: messages, isLoading: messagesLoading } = useMessages(chat?.id || "");
	return /* @__PURE__ */ jsx(ChatScreen, {
		chat: chat || null,
		isLoading,
		error,
		messages: messages || [],
		messagesLoading
	});
});
var ErrorBoundary$9 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/feature/documents/components/document-card.tsx
function DocumentCard({ document, variant = "default", displayMode = "list", onView, onDownload, onBookmark, className = "" }) {
	const handleView = (e) => {
		e.preventDefault();
		if (onView && document.storageUrl) onView(document.storageUrl);
	};
	const handleDownload = (e) => {
		e.preventDefault();
		if (onDownload && document.storageUrl) onDownload(document.storageUrl);
	};
	const handleBookmark = (e) => {
		e.preventDefault();
		if (onBookmark) onBookmark(document);
	};
	const handleShare = (e) => {
		e.preventDefault();
		console.log("Sharing document:", document.title);
	};
	const defaultActions = /* @__PURE__ */ jsx("div", {
		className: "mt-4 pt-4 border-t border-gray-200",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center space-x-3 text-sm text-gray-500",
				children: [
					/* @__PURE__ */ jsxs("span", {
						className: "flex items-center",
						children: [/* @__PURE__ */ jsx("svg", {
							className: "w-4 h-4 mr-1",
							fill: "none",
							stroke: "currentColor",
							viewBox: "0 0 24 24",
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: "2",
								d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2h-10a2 2 0 00-2 2v12a2 2 0 002 2z"
							})
						}), document.lastUpdated]
					}),
					/* @__PURE__ */ jsx("span", { className: "h-1 w-1 rounded-full bg-gray-400" }),
					/* @__PURE__ */ jsxs("span", {
						className: "flex items-center",
						children: [
							/* @__PURE__ */ jsx("svg", {
								className: "w-4 h-4 mr-1",
								fill: "none",
								stroke: "currentColor",
								viewBox: "0 0 24 24",
								children: /* @__PURE__ */ jsx("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeWidth: "2",
									d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002 2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								})
							}),
							document.sections,
							" Sections"
						]
					})
				]
			}), /* @__PURE__ */ jsx(Link, {
				to: `/documents/${document.id}`,
				children: /* @__PURE__ */ jsx(MahButton, {
					variant: "primary",
					children: "View full document"
				})
			})]
		})
	});
	const minimalActions = /* @__PURE__ */ jsxs("div", {
		className: "flex justify-between items-center mt-3 pt-3 border-t border-gray-200",
		children: [/* @__PURE__ */ jsxs(MahButton, {
			onClick: handleView,
			variant: "secondary",
			children: [/* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5 mr-1.5" }), "View"]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center space-x-2",
			children: [
				/* @__PURE__ */ jsx(BookmarkButton, {
					onClick: handleBookmark,
					isBookmarked: document.bookmarkCount !== void 0 && document.bookmarkCount > 0,
					bookmarkCount: document.bookmarkCount,
					size: "sm"
				}),
				/* @__PURE__ */ jsx("div", { className: "h-4 w-px bg-gray-300 mx-1" }),
				/* @__PURE__ */ jsxs(MahButton, {
					onClick: handleDownload,
					variant: "secondary",
					children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), document.downloadCount !== void 0 && /* @__PURE__ */ jsx("span", {
						className: "text-xs ml-1 text-gray-500",
						children: document.downloadCount
					})]
				})
			]
		})]
	});
	if (displayMode === "grid") return variant === "minimal" ? /* @__PURE__ */ jsxs(MahCard, {
		variant: "default",
		className: "group",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-start mb-4",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex justify-start",
					children: /* @__PURE__ */ jsx(IconContainer, {
						icon: FileText,
						size: "lg",
						color: "outline",
						className: "flex-shrink-0"
					})
				}), /* @__PURE__ */ jsx(ShareButton, {
					onClick: handleShare,
					className: "p-2 text-sm font-medium border-2 border-black rounded-full bg-white shadow-[3px_3px_0_0_#000]",
					"aria-label": "Share document"
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "text-left mb-4",
				children: /* @__PURE__ */ jsx("h3", {
					className: "font-black text-gray-900 text-base mt-1 font-serif",
					children: document.title
				})
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-sm text-gray-600 mb-4 line-clamp-3 flex-1",
				children: document.description
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-auto pt-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsxs(MahButton, {
						href: `/documents/${document.id}`,
						variant: "card",
						className: "flex-[2]",
						children: [/* @__PURE__ */ jsx(Eye, { className: "w-4 h-4 mr-2" }), "View Document"]
					}), /* @__PURE__ */ jsx(BookmarkButton, {
						onClick: handleBookmark,
						isBookmarked: document.bookmarkCount !== void 0 && document.bookmarkCount > 0,
						bookmarkCount: document.bookmarkCount,
						size: "sm",
						className: "p-2 text-sm font-medium border-2 border-black rounded-full bg-white shadow-[3px_3px_0_0_#000] flex-[1] h-full"
					})]
				})
			})
		]
	}) : /* @__PURE__ */ jsxs(MahCard, {
		variant: "default",
		className: "group",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-start mb-4",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex justify-start",
					children: /* @__PURE__ */ jsx(IconContainer, {
						icon: FileText,
						size: "lg",
						color: "outline",
						className: "flex-shrink-0"
					})
				}), /* @__PURE__ */ jsx(ShareButton, {
					onClick: handleShare,
					className: "p-2 text-sm font-medium border-2 border-black rounded-full bg-white shadow-[3px_3px_0_0_#000]",
					"aria-label": "Share document"
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "text-left mb-4",
				children: /* @__PURE__ */ jsx("h3", {
					className: "font-black text-gray-900 text-base mt-1 font-serif",
					children: document.title
				})
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-sm text-gray-600 mb-4 line-clamp-3 flex-1",
				children: document.description
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-auto pt-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsxs(MahButton, {
						href: `/documents/${document.id}`,
						variant: "card",
						className: "flex-[2]",
						children: [/* @__PURE__ */ jsx(Eye, { className: "w-4 h-4 mr-2" }), "View Document"]
					}), /* @__PURE__ */ jsx(BookmarkButton, {
						onClick: handleBookmark,
						isBookmarked: document.bookmarkCount !== void 0 && document.bookmarkCount > 0,
						bookmarkCount: document.bookmarkCount,
						size: "sm",
						className: "p-2 text-sm font-medium border-2 border-black rounded-full bg-white shadow-[3px_3px_0_0_#000] flex-[1] h-full"
					})]
				})
			})
		]
	});
	if (displayMode === "list") return variant === "minimal" ? /* @__PURE__ */ jsx(MahCard, {
		variant: "minimal",
		className,
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-start",
			children: [/* @__PURE__ */ jsx("div", {
				className: "mr-3 flex-shrink-0",
				children: /* @__PURE__ */ jsx(IconContainer, {
					icon: FileText,
					size: "md",
					color: "outline",
					className: "mt-0.5"
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-medium text-gray-900 text-sm mb-1",
						children: document.title
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-2 py-0.5 ml-2 whitespace-nowrap flex-shrink-0 bg-white",
						children: document.type
					})]
				}), minimalActions]
			})]
		})
	}) : /* @__PURE__ */ jsx(MahCard, {
		variant: "outlined",
		className: `group transition-all duration-200 hover:-translate-y-1 ${className}`,
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-start",
			children: [/* @__PURE__ */ jsx("div", {
				className: "mr-5",
				children: /* @__PURE__ */ jsx(IconContainer, {
					icon: FileText,
					size: "lg",
					color: "outline",
					className: "bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100 transition-colors"
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex-1 min-w-0",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-bold text-gray-900 mb-2 pr-4",
							children: document.title
						}), /* @__PURE__ */ jsx("span", {
							className: "px-3 py-1 text-gray-700 text-xs font-medium border border-gray-300 rounded-full whitespace-nowrap flex-shrink-0 bg-white",
							children: document.type
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-gray-600 line-clamp-2 mb-4",
						children: document.description
					}),
					defaultActions
				]
			})]
		})
	});
	return /* @__PURE__ */ jsxs(MahCard, {
		variant: "minimal",
		className,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "p-4 flex-1",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-start mb-3",
				children: [/* @__PURE__ */ jsx(IconContainer, {
					icon: FileText,
					size: "lg",
					color: "outline",
					className: "flex-shrink-0"
				}), /* @__PURE__ */ jsxs("div", {
					className: "ml-3",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs font-medium text-gray-500",
						children: document.type
					}), /* @__PURE__ */ jsx("h3", {
						className: "font-medium text-gray-900 text-sm mt-0.5",
						children: document.title
					})]
				})]
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-gray-500 line-clamp-3 mb-4",
				children: document.description
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "px-4 py-3 bg-gray-50 border-t border-gray-100",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between text-xs text-gray-500",
				children: [/* @__PURE__ */ jsx("span", { children: document.lastUpdated }), /* @__PURE__ */ jsxs("span", { children: [document.sections, " Sections"] })]
			})
		})]
	});
}
//#endregion
//#region app/feature/documents/components/document-collection.tsx
function DocumentCollection({ documents, displayMode: externalDisplayMode = "grid", variant = "default", showControls = true, onDisplayModeChange }) {
	const [displayMode, setDisplayMode] = useState(externalDisplayMode);
	useEffect(() => {
		setDisplayMode(externalDisplayMode);
	}, [externalDisplayMode]);
	const handleDisplayModeChange = (mode) => {
		setDisplayMode(mode);
		onDisplayModeChange?.(mode);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [showControls && /* @__PURE__ */ jsx(ListControls, {
			totalItems: documents.length,
			label: "Legal Documents",
			displayMode,
			onDisplayModeChange: handleDisplayModeChange
		}), displayMode === "grid" ? /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
			children: documents.map((doc) => /* @__PURE__ */ jsx(DocumentCard, {
				document: doc,
				displayMode: "grid",
				variant,
				className: "h-full"
			}, doc.id))
		}) : /* @__PURE__ */ jsx("div", {
			className: "space-y-4",
			children: documents.map((doc) => /* @__PURE__ */ jsx(DocumentCard, {
				document: doc,
				displayMode: "list",
				variant
			}, doc.id))
		})]
	});
}
//#endregion
//#region app/components/page-loading.tsx
function PageLoading({ title = "Loading Content", description = "Please wait while we load your content...", showSkeleton = true, skeletonCount = 3, displayMode = "grid", className = "" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `space-y-6 ${className}`,
		children: [/* @__PURE__ */ jsx(CardWithLabel, {
			label: "Loading",
			className: "bg-white",
			labelClassName: "text-blue-600",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-start gap-4",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex-shrink-0 mt-1",
					children: /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 text-blue-600 animate-spin" })
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-lg font-medium text-gray-900 mb-2",
						children: title
					}), /* @__PURE__ */ jsx("div", {
						className: "text-gray-700 text-sm",
						children: /* @__PURE__ */ jsx("p", { children: description })
					})]
				})]
			})
		}), showSkeleton && /* @__PURE__ */ jsx("div", {
			className: "space-y-4",
			children: displayMode === "grid" ? /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
				children: Array.from({ length: skeletonCount }).map((_, index) => /* @__PURE__ */ jsx("div", {
					className: "bg-white border-2 border-gray-900 rounded-lg p-6 animate-pulse",
					style: { borderRadius: "8px 16px 8px 16px" },
					children: /* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-4",
								children: [/* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-200 rounded-full border-2 border-gray-300" }), /* @__PURE__ */ jsxs("div", {
									className: "flex-1 space-y-2",
									children: [/* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-200 rounded w-3/4" }), /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-1/2" })]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded" }), /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-5/6" })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("div", { className: "h-8 bg-gray-200 rounded w-24" }), /* @__PURE__ */ jsx("div", { className: "h-8 bg-gray-200 rounded w-20" })]
							})
						]
					})
				}, index))
			}) : /* @__PURE__ */ jsx("div", {
				className: "space-y-4",
				children: Array.from({ length: skeletonCount }).map((_, index) => /* @__PURE__ */ jsx("div", {
					className: "bg-white border-2 border-gray-900 rounded-lg p-6 animate-pulse",
					style: { borderRadius: "8px 16px 8px 16px" },
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-start gap-6",
						children: [/* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-200 rounded-full border-2 border-gray-300 flex-shrink-0" }), /* @__PURE__ */ jsxs("div", {
							className: "flex-1 space-y-3",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-200 rounded w-3/4" }), /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-1/2" })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded" }),
										/* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-5/6" }),
										/* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-2/3" })
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 pt-2",
									children: [/* @__PURE__ */ jsx("div", { className: "h-8 bg-gray-200 rounded w-24" }), /* @__PURE__ */ jsx("div", { className: "h-8 bg-gray-200 rounded w-20" })]
								})
							]
						})]
					})
				}, index))
			})
		})]
	});
}
//#endregion
//#region app/feature/documents/screens/DocumentsScreen.tsx
var DocumentsScreen = ({ documents, isLoading, isAuthenticated, displayMode, onDisplayModeChange }) => {
	if (isLoading) return /* @__PURE__ */ jsx(PageLoading, {
		title: "Loading Legal Documents",
		description: "Please wait while we fetch the latest legal documents...",
		displayMode,
		skeletonCount: 5
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [!isAuthenticated && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(HeroSection, {
		title: "Legal Database",
		description: "Access a comprehensive collection of legal documents, acts, and regulations.",
		icon: Library,
		actionVariant: "search"
	}), /* @__PURE__ */ jsx(DiagonalSeparator, {})] }), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", {
		className: "w-full",
		children: documents.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
			title: "No documents found",
			description: "Try adjusting your search or check back later for updates."
		}) : /* @__PURE__ */ jsx(DocumentCollection, {
			documents,
			displayMode,
			showControls: !!onDisplayModeChange,
			onDisplayModeChange
		})
	}) })] });
};
//#endregion
//#region app/lib/react-query/react-query.utils.ts
function createPrefetchLoader(configs, options) {
	return async () => {
		if (options?.throwOnError) await Promise.all(configs.map(({ queryKey, queryFn, staleTime }) => queryClient.ensureQueryData({
			queryKey,
			queryFn,
			staleTime
		})));
		else {
			const results = await Promise.allSettled(configs.map(({ queryKey, queryFn, staleTime }) => queryClient.ensureQueryData({
				queryKey,
				queryFn,
				staleTime
			})));
			if (options?.returnData) return results.map((r) => r.status === "fulfilled" ? r.value : null);
		}
		return null;
	};
}
function prefetch(config) {
	return config;
}
//#endregion
//#region app/routes/documents/index.tsx
var documents_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$8,
	default: () => documents_default,
	loader: () => loader$5,
	meta: () => meta$8
});
function meta$8({}) {
	return [
		{ title: "Legal Database - Access South Sudan & Uganda Laws" },
		{
			name: "description",
			content: "Free access to comprehensive legal documents from South Sudan and Uganda. Search and browse national constitutions, criminal codes, and other essential legislation in one place."
		},
		{
			name: "keywords",
			content: "South Sudan laws, Uganda legal documents, free legal texts, criminal code, constitution, labor laws, legal database, African law"
		},
		{
			name: "og:title",
			content: "Free Legal Database - South Sudan & Uganda Laws"
		},
		{
			name: "og:description",
			content: "Access complete legal texts from South Sudan and Uganda. Search and download official legal documents, all in one place."
		},
		{
			name: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:title",
			content: "Legal Database - South Sudan & Uganda"
		},
		{
			name: "twitter:description",
			content: "Your free resource for accessing and understanding the laws of South Sudan and Uganda. Search and browse legal documents with ease."
		}
	];
}
var prefetchDocuments = createPrefetchLoader([prefetch({
	queryKey: documentsKeys.documents(),
	queryFn: () => documentsApi.getDocuments(),
	staleTime: 3e5
})]);
async function loader$5({ context }) {
	const user = context.get(userContext);
	const token = context.get(authContext)?.token || null;
	await prefetchDocuments();
	return {
		user,
		token
	};
}
var documents_default = UNSAFE_withComponentProps(function LegalDatabase({ loaderData }) {
	const { user } = loaderData;
	const { data: documents = [], isLoading } = useDocuments();
	const [displayMode, setDisplayMode] = useState("grid");
	return /* @__PURE__ */ jsx(DocumentsScreen, {
		documents,
		isLoading,
		isAuthenticated: !!user,
		displayMode,
		onDisplayModeChange: setDisplayMode
	});
});
var ErrorBoundary$8 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/feature/documents/components/document-details-header.tsx
function DocumentDetailsHeader({ document }) {
	return /* @__PURE__ */ jsx(PageDetailHeader, {
		type: document.type,
		title: document.title,
		description: document.description,
		icon: FileText,
		metadata: [{
			icon: Calendar,
			label: "Last updated",
			value: document.lastUpdated
		}, {
			icon: FileText,
			label: "Sections",
			value: document.sections
		}],
		actions: [
			{
				label: "Download PDF",
				icon: Download,
				href: document.storageUrl,
				download: true,
				variant: "primary"
			},
			{
				label: "Share",
				icon: Share2,
				onClick: () => console.log("Share clicked"),
				variant: "secondary"
			},
			{
				label: "Save",
				icon: Bookmark,
				onClick: () => console.log("Save clicked"),
				variant: "secondary"
			}
		]
	});
}
//#endregion
//#region app/feature/documents/components/document-highlights.tsx
function DocumentHighlights({ highlights }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-2",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "text-lg font-semibold text-gray-900",
				children: "Key Highlights"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-gray-500",
				children: "Important points and key information from this document."
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "space-y-4",
			children: highlights.map((highlight, index) => /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3 bg-white px-4 py-3 rounded-lg border-2 border-gray-900",
				style: { boxShadow: "2px 2px 0 0 #000" },
				children: [/* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-green-600" }), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", {
					className: "text-base font-semibold text-gray-900",
					children: highlight
				}) })]
			}, index))
		})]
	});
}
//#endregion
//#region app/feature/documents/components/related-documents.tsx
function RelatedDocuments({ documents }) {
	if (documents.length === 0) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-2",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "text-lg font-semibold text-gray-900",
				children: "Related Documents"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-gray-500",
				children: "Similar documents you might find helpful."
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "space-y-4",
			children: documents.map((doc) => /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3 bg-white px-4 py-3 rounded-lg border-2 border-gray-900",
				style: { boxShadow: "2px 2px 0 0 #000" },
				children: [/* @__PURE__ */ jsx(FileText, { className: "w-5 h-5 text-blue-600" }), /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-sm font-medium text-gray-500",
						children: "Related Document"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-base font-semibold text-gray-900",
						children: doc.title
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-sm text-gray-500",
						children: [
							doc.type,
							" • Updated ",
							doc.lastUpdated
						]
					})
				] })]
			}, doc.id))
		})]
	});
}
//#endregion
//#region app/feature/documents/screens/DocumentDetailsScreen.tsx
var DocumentDetailsScreen = ({ document, error }) => {
	if (!document) return /* @__PURE__ */ jsxs("div", {
		className: "text-center p-6 max-w-md",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "text-2xl font-bold text-foreground mb-2",
			children: error ? "Error Loading Document" : "Document Not Found"
		}), /* @__PURE__ */ jsx("p", {
			className: "text-muted-foreground",
			children: error || "We couldn't find the document you're looking for."
		})]
	});
	const breadcrumbs = [
		{
			label: "Legal Database",
			to: "/documents"
		},
		{
			label: document.type === "Case Law" ? "Case Law" : document.type,
			to: `/documents?type=${document.type.toLowerCase()}`
		},
		{
			label: document.title,
			to: `#`
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			breadcrumbs,
			className: "hidden sm:flex"
		}),
		/* @__PURE__ */ jsx(DocumentDetailsHeader, { document }),
		/* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6",
			children: [/* @__PURE__ */ jsx("div", {
				className: "lg:col-span-2 space-y-6",
				children: /* @__PURE__ */ jsx(DocumentHighlights, { highlights: [
					`Key provision in Section 4.2 about ${document.type} requirements`,
					`Important update in the ${new Date(document.updatedAt).getFullYear()} version`,
					`Special considerations for ${document.type === "Act" ? "legal" : "regulatory"} compliance`,
					`Recent amendments effective from ${document.lastUpdated}`
				] })
			}), /* @__PURE__ */ jsx("div", {
				className: "lg:col-span-1 space-y-6",
				children: /* @__PURE__ */ jsx(RelatedDocuments, { documents: [{
					id: "2",
					title: "Land Acquisition Act 2021",
					type: "Act",
					lastUpdated: "2023-05-15"
				}] })
			})]
		})
	] });
};
//#endregion
//#region app/routes/documents/$documentId.tsx
var $documentId_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$7,
	default: () => $documentId_default,
	meta: () => meta$7
});
function meta$7({}) {
	return [{ title: "Document - Mahakama" }, {
		name: "description",
		content: "View document details"
	}];
}
var $documentId_default = UNSAFE_withComponentProps(function DocumentDetails({ params }) {
	const { documentId } = params;
	const { data: document, isLoading, error } = useDocument(documentId);
	return /* @__PURE__ */ jsx(DocumentDetailsScreen, {
		document,
		error: ""
	});
});
var ErrorBoundary$7 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/feature/lawyers/components/lawyer-card.tsx
var getFirstName = (name) => {
	if (!name) return "Lawyer";
	return name.split(" ")[0];
};
var handleBookmark = (e) => {
	e.preventDefault();
	console.log("Bookmarking lawyer:");
};
var handleShare = (e) => {
	e.preventDefault();
	console.log("Sharing lawyer:");
};
function LawyerCard({ lawyer, variant = "default", displayMode = "list" }) {
	const getExperienceText = (years) => {
		if (years === void 0 || years === null) return "No experience";
		return years === 1 ? `${years} year` : `${years} years`;
	};
	Array.isArray(lawyer.languages) && lawyer.languages;
	return /* @__PURE__ */ jsxs(MahCard, {
		variant: displayMode === "grid" ? "default" : "minimal",
		className: displayMode === "grid" ? "group" : "",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-start mb-4",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex justify-start",
					children: /* @__PURE__ */ jsxs(Avatar, {
						className: "w-20 h-20 border-2 border-gray-900 flex-shrink-0",
						style: { boxShadow: "2px 2px 0 0 #000" },
						children: [/* @__PURE__ */ jsx(AvatarImage, {
							src: `https://picsum.photos/seed/lawyer-${lawyer.id}/200/200.jpg`,
							alt: `${lawyer.name} profile picture`
						}), /* @__PURE__ */ jsx(AvatarFallback, {
							className: "bg-gray-100 text-gray-600 font-semibold",
							children: lawyer.name ? lawyer.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "LW"
						})]
					})
				}), /* @__PURE__ */ jsx(ShareButton, {
					onClick: handleShare,
					className: "p-2 text-sm font-medium border-2 border-black rounded-full bg-white shadow-[3px_3px_0_0_#000]",
					"aria-label": "Share lawyer"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "text-left mb-4",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-xl",
					children: lawyer.name || "Unnamed Lawyer"
				}), lawyer.location && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center text-sm text-gray-600 mt-1",
					children: [/* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 mr-1 flex-shrink-0" }), /* @__PURE__ */ jsx("span", {
						className: "truncate",
						children: lawyer.location
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex gap-4 items-center",
				children: [lawyer.specialization && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 text-sm text-gray-600 mt-1",
					children: [/* @__PURE__ */ jsx(Briefcase, { className: "h-4 w-4 mr-1 flex-shrink-0" }), /* @__PURE__ */ jsx("span", {
						className: "font-medium",
						children: lawyer.specialization
					})]
				}), lawyer.experienceYears && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 text-sm text-gray-600",
					children: [/* @__PURE__ */ jsx(Briefcase, { className: "h-4 w-4 mr-1 flex-shrink-0" }), /* @__PURE__ */ jsx("span", {
						className: "font-medium",
						children: getExperienceText(lawyer.experienceYears)
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-auto pt-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsxs(MahButton, {
						href: `/lawyers/${lawyer.id}`,
						variant: "card",
						className: "flex-[2]",
						children: [
							"View ",
							getFirstName(lawyer.name),
							"'s Profile",
							/* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 ml-1" })
						]
					}), /* @__PURE__ */ jsx(BookmarkButton, {
						onClick: handleBookmark,
						className: "p-2 text-sm font-medium border-2 border-black rounded-full bg-white shadow-[3px_3px_0_0_#000] flex-[1] h-full",
						"aria-label": "Bookmark lawyer"
					})]
				})
			})
		]
	});
}
//#endregion
//#region app/feature/lawyers/components/filter-selector.tsx
function FilterSelector({ currentFilter, onFilterChange }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex-shrink-0",
		children: [/* @__PURE__ */ jsx("div", {
			className: "text-sm text-gray-600 mb-2",
			children: "Filter by:"
		}), /* @__PURE__ */ jsxs(Select, {
			value: currentFilter,
			onValueChange: onFilterChange,
			children: [/* @__PURE__ */ jsx(SelectTrigger, {
				className: "w-48",
				children: /* @__PURE__ */ jsx(SelectValue, {})
			}), /* @__PURE__ */ jsxs(SelectContent, { children: [
				/* @__PURE__ */ jsx(SelectItem, {
					value: "specialization",
					children: "By Specialization"
				}),
				/* @__PURE__ */ jsx(SelectItem, {
					value: "location",
					children: "By Location"
				}),
				/* @__PURE__ */ jsx(SelectItem, {
					value: "isAvailable",
					children: "By Availability"
				}),
				/* @__PURE__ */ jsx(SelectItem, {
					value: "all",
					children: "Clear Filter"
				})
			] })]
		})]
	});
}
//#endregion
//#region app/feature/lawyers/components/filter-options.tsx
function FilterOptions({ currentFilter, currentSpecialization, currentLocation, currentAvailable, onSpecializationChange, onLocationChange, onAvailableChange }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex-1",
		children: [
			currentFilter === "specialization" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 mb-2",
				children: [/* @__PURE__ */ jsx(Users, { className: "h-4 w-4 text-gray-600" }), /* @__PURE__ */ jsx("span", {
					className: "text-sm text-gray-600",
					children: "Select specialization:"
				})]
			}), /* @__PURE__ */ jsxs(Select, {
				value: currentSpecialization,
				onValueChange: onSpecializationChange,
				children: [/* @__PURE__ */ jsx(SelectTrigger, {
					className: "w-full max-w-xs",
					children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select specialization..." })
				}), /* @__PURE__ */ jsxs(SelectContent, { children: [
					/* @__PURE__ */ jsx(SelectItem, {
						value: "family-law",
						children: "Family Law"
					}),
					/* @__PURE__ */ jsx(SelectItem, {
						value: "criminal-law",
						children: "Criminal Law"
					}),
					/* @__PURE__ */ jsx(SelectItem, {
						value: "corporate-law",
						children: "Corporate Law"
					}),
					/* @__PURE__ */ jsx(SelectItem, {
						value: "immigration-law",
						children: "Immigration Law"
					}),
					/* @__PURE__ */ jsx(SelectItem, {
						value: "property-law",
						children: "Property Law"
					}),
					/* @__PURE__ */ jsx(SelectItem, {
						value: "employment-law",
						children: "Employment Law"
					}),
					/* @__PURE__ */ jsx(SelectItem, {
						value: "civil-rights",
						children: "Civil Rights"
					}),
					/* @__PURE__ */ jsx(SelectItem, {
						value: "tax-law",
						children: "Tax Law"
					})
				] })]
			})] }),
			currentFilter === "location" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 mb-2",
				children: [/* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-gray-600" }), /* @__PURE__ */ jsx("span", {
					className: "text-sm text-gray-600",
					children: "Enter location:"
				})]
			}), /* @__PURE__ */ jsx(Input, {
				placeholder: "Enter city or region...",
				value: currentLocation,
				onChange: (e) => onLocationChange(e.target.value),
				className: "w-full max-w-xs"
			})] }),
			currentFilter === "isAvailable" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 mb-2",
				children: [/* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-gray-600" }), /* @__PURE__ */ jsx("span", {
					className: "text-sm text-gray-600",
					children: "Select availability:"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ jsx(Button, {
					variant: currentAvailable === "true" ? "default" : "outline",
					size: "sm",
					onClick: () => onAvailableChange("true"),
					children: "Available Now"
				}), /* @__PURE__ */ jsx(Button, {
					variant: currentAvailable === "false" ? "default" : "outline",
					size: "sm",
					onClick: () => onAvailableChange("false"),
					children: "Not Available"
				})]
			})] })
		]
	});
}
//#endregion
//#region app/feature/lawyers/components/filter-section.tsx
function FilterSection({ currentFilter, currentSpecialization, currentLocation, currentAvailable, onFilterChange, onSpecializationChange, onLocationChange, onAvailableChange, onClose, showFilterBadge = false }) {
	const getFilterDisplayLabel = () => {
		if (currentFilter === "specialization" && currentSpecialization) return `Specialization: ${currentSpecialization.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}`;
		if (currentFilter === "location" && currentLocation) return `Location: ${currentLocation}`;
		if (currentFilter === "isAvailable" && currentAvailable) return `Availability: ${currentAvailable === "true" ? "Available" : "Not Available"}`;
		return null;
	};
	const currentFilterLabel = getFilterDisplayLabel();
	return /* @__PURE__ */ jsxs(CardWithLabel, {
		label: "Filter Lawyers",
		className: "px-4 py-3 border-solid border-gray-150 rounded-[8px_16px_8px_16px] max-w-none mx-0",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex justify-between items-start mb-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex gap-6 flex-1",
				children: [/* @__PURE__ */ jsx(FilterSelector, {
					currentFilter,
					onFilterChange
				}), /* @__PURE__ */ jsx(FilterOptions, {
					currentFilter,
					currentSpecialization,
					currentLocation,
					currentAvailable,
					onSpecializationChange,
					onLocationChange,
					onAvailableChange
				})]
			}), onClose && /* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				size: "sm",
				onClick: onClose,
				className: "flex-shrink-0 h-8 w-8 p-0 hover:bg-gray-100",
				children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
			})]
		}), showFilterBadge && currentFilterLabel && /* @__PURE__ */ jsx("div", {
			className: "flex items-center gap-2 pt-2 border-t border-gray-200",
			children: /* @__PURE__ */ jsxs(Badge, {
				variant: "secondary",
				className: "px-3 py-1 bg-blue-100 text-blue-800 border-blue-200",
				children: [
					/* @__PURE__ */ jsx(Filter, { className: "h-3 w-3 mr-1" }),
					currentFilterLabel,
					/* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => onFilterChange("all"),
						className: "ml-2 h-4 w-4 p-0 hover:bg-blue-200",
						children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
					})
				]
			})
		})]
	});
}
//#endregion
//#region app/feature/lawyers/components/lawyers-list.tsx
function LawyersList({ lawyers = [], displayMode, onDisplayModeChange, variant = "default", showControls = true, currentFilter, currentSpecialization, currentLocation, currentAvailable, currentSearch, filterOptions, onFilterChange, onSpecializationChange, onLocationChange, onAvailableChange, onSearch, currentSortField, currentSortOrder, sortOptions, onSortChange }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			showControls && /* @__PURE__ */ jsx(ListControls, {
				totalItems: lawyers.length,
				itemName: "lawyer",
				label: "Lawyers",
				displayMode,
				onDisplayModeChange,
				filterBy: currentFilter,
				filterOptions,
				onFilterChange,
				sortBy: currentSortField,
				sortOrder: currentSortOrder,
				sortOptions,
				onSortChange,
				onSearch,
				searchValue: currentSearch,
				searchPlaceholder: "Search lawyers by name, specialization, or location..."
			}),
			(currentFilter === "specialization" || currentFilter === "location" || currentFilter === "isAvailable") && /* @__PURE__ */ jsx(FilterSection, {
				currentFilter,
				currentSpecialization,
				currentLocation,
				currentAvailable,
				onFilterChange,
				onSpecializationChange,
				onLocationChange,
				onAvailableChange,
				onClose: () => onFilterChange("all"),
				showFilterBadge: true
			}),
			lawyers.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
				label: "No Lawyers Found",
				title: "No Lawyers Match Your Search",
				description: currentSearch || currentFilter !== "all" ? `No lawyers found matching your search criteria. Try adjusting your filters or search term.` : "No lawyers are available at the moment. Please check back later.",
				actions: [{
					label: "Clear Filters",
					onClick: () => {
						onFilterChange("all");
						onSearch("");
					},
					variant: "outline"
				}],
				showDefaultActions: true
			}) : /* @__PURE__ */ jsx(Fragment, { children: displayMode === "grid" ? /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
				children: lawyers.map((lawyer) => /* @__PURE__ */ jsx("div", {
					className: "h-full",
					children: /* @__PURE__ */ jsx(LawyerCard, {
						lawyer,
						variant,
						displayMode: "grid"
					})
				}, lawyer.id))
			}) : /* @__PURE__ */ jsx("div", {
				className: "space-y-4",
				children: lawyers.map((lawyer) => /* @__PURE__ */ jsx(LawyerCard, {
					lawyer,
					variant,
					displayMode: "list"
				}, lawyer.id))
			}) })
		]
	});
}
//#endregion
//#region app/feature/lawyers/screens/LawyersScreen.tsx
var LawyersScreen = ({ lawyers, error, isLoading, isAuthenticated, displayMode, onDisplayModeChange, currentFilter, currentSpecialization, currentLocation, currentAvailable, currentSearch, filterOptions, onFilterChange, onSpecializationChange, onLocationChange, onAvailableChange, onSearch, currentSortField, currentSortOrder, sortOptions, onSortChange }) => {
	return /* @__PURE__ */ jsxs("div", { children: [!isAuthenticated && /* @__PURE__ */ jsxs("div", {
		className: "bg-background",
		children: [/* @__PURE__ */ jsx(HeroSection, {
			title: "Find Trusted Legal Professionals",
			description: "Connect with vetted lawyers and legal experts in various fields of law. Get the right legal assistance for your specific needs.",
			actionVariant: "search",
			icon: Gavel
		}), /* @__PURE__ */ jsx(DiagonalSeparator, {})]
	}), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { children: error ? /* @__PURE__ */ jsx(ErrorState, { error }) : /* @__PURE__ */ jsx(LawyersList, {
		lawyers,
		displayMode,
		onDisplayModeChange,
		variant: "default",
		showControls: true,
		currentFilter,
		currentSpecialization,
		currentLocation,
		currentAvailable,
		currentSearch,
		filterOptions,
		onFilterChange,
		onSpecializationChange,
		onLocationChange,
		onAvailableChange,
		onSearch,
		currentSortField,
		currentSortOrder,
		sortOptions,
		onSortChange
	}) }) })] });
};
//#endregion
//#region app/lib/api/lawyers.api.ts
var LawyersApiClient = class {
	api;
	constructor() {
		this.api = new FetchApiClient();
	}
	async getLawyers(filters) {
		try {
			let url = LAWYERS_API_ROUTES.ROOT;
			const searchParams = new URLSearchParams();
			if (filters) {
				if (filters.specialization) searchParams.append("specialization", filters.specialization);
				if (filters.location) searchParams.append("location", filters.location);
				if (filters.available !== void 0) searchParams.append("available", filters.available.toString());
				if (filters.q) searchParams.append("q", filters.q);
			}
			const queryString = searchParams.toString();
			if (queryString) url += `?${queryString}`;
			const response = await this.api.request(url);
			if (!response.data) {
				console.error("Invalid lawyers data:", response);
				throw new Error("Invalid lawyers data received from the server");
			}
			return response.data.map((resource) => resource.attributes);
		} catch (error) {
			console.error("Failed to fetch lawyers:", error);
			throw error;
		}
	}
	async getLawyerById(lawyerId) {
		try {
			const response = await this.api.request(LAWYERS_API_ROUTES.ROOT + `/${lawyerId}`);
			if (!response.data.attributes) {
				console.error("Invalid lawyer data:", response);
				throw new Error("Invalid lawyer data received from the server");
			}
			return response.data.attributes;
		} catch (error) {
			console.error("Failed to fetch lawyer:", error);
			throw error;
		}
	}
	async createLawyer(lawyerData) {
		try {
			const response = await this.api.request(LAWYERS_API_ROUTES.ROOT, {
				method: "POST",
				body: JSON.stringify(lawyerData)
			});
			if (!response.data.attributes) {
				console.error("Invalid lawyer data:", response);
				throw new Error("Invalid lawyer data received from the server");
			}
			return response.data.attributes;
		} catch (error) {
			console.error("Failed to create lawyer:", error);
			throw error;
		}
	}
	async getLawyerByEmail(email) {
		try {
			const response = await this.api.request(LAWYERS_API_ROUTES.ROOT + `/email?email=${encodeURIComponent(email)}`);
			if (!response.data.attributes) {
				console.error("Invalid lawyer data:", response);
				throw new Error("Invalid lawyer data received from the server");
			}
			return response.data.attributes;
		} catch (error) {
			console.error("Failed to fetch lawyer:", error);
			throw error;
		}
	}
};
var lawyersApi = new LawyersApiClient();
//#endregion
//#region app/feature/lawyers/hooks/use-lawyers.tsx
var lawyersKeys = {
	all: ["lawyers"],
	lawyers: () => [...lawyersKeys.all, "lawyers"],
	lawyer: (id) => [
		...lawyersKeys.all,
		"lawyer",
		id
	]
};
function useLawyers(filters) {
	return useQuery({
		queryKey: filters ? [
			...lawyersKeys.lawyers(),
			"filters",
			filters
		] : lawyersKeys.lawyers(),
		queryFn: async () => {
			return await lawyersApi.getLawyers(filters);
		},
		meta: {
			errorToast: true,
			errorMessage: "Failed to load lawyers"
		}
	});
}
function useLawyer(id) {
	return useQuery({
		queryKey: lawyersKeys.lawyer(id),
		queryFn: async () => {
			return await lawyersApi.getLawyerById(id);
		},
		enabled: !!id,
		meta: {
			errorToast: true,
			errorMessage: "Failed to load lawyer"
		}
	});
}
//#endregion
//#region app/hooks/use-debounce.ts
function useDebouncedValue(value, delay = 400) {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebounced(value);
		}, delay);
		return () => clearTimeout(timer);
	}, [value, delay]);
	return debounced;
}
//#endregion
//#region app/routes/lawyers/index.tsx
var lawyers_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$6,
	default: () => lawyers_default,
	loader: () => loader$4,
	meta: () => meta$6
});
function meta$6({}) {
	return [
		{ title: "Find Vetted Lawyers in South Sudan & Uganda - Mahakama" },
		{
			name: "description",
			content: "Connect with experienced, vetted legal professionals in South Sudan and Uganda. Get expert help with family law, employment rights, housing issues, and more through our trusted network."
		},
		{
			name: "keywords",
			content: "find lawyer South Sudan, Uganda attorneys, legal professionals, vetted lawyers, legal consultation, family law, employment law, housing rights, legal representation"
		},
		{
			name: "og:title",
			content: "Find Trusted Legal Professionals - Mahakama"
		},
		{
			name: "og:description",
			content: "Connect with vetted legal experts in South Sudan and Uganda for personalized legal assistance and representation when you need it most."
		},
		{
			name: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:title",
			content: "Find Vetted Lawyers in East Africa"
		},
		{
			name: "twitter:description",
			content: "Mahakama connects you with trusted legal professionals in South Sudan and Uganda for expert legal advice and representation."
		}
	];
}
async function loader$4({ context }) {
	try {
		return {
			user: context.get(userContext),
			token: context.get(authContext)?.token || null,
			error: null
		};
	} catch (error) {
		handleRouteError(error, "Failed to load user data");
	}
}
var lawyers_default = UNSAFE_withComponentProps(function LawyersPage({ loaderData }) {
	const { user, error } = loaderData;
	if (error) return /* @__PURE__ */ jsx(PageLoading, {
		title: "Authentication Error",
		description: "There was a problem loading your user session. Please try refreshing the page.",
		showSkeleton: false
	});
	const [searchParams, setSearchParams] = useSearchParams();
	const [displayMode, setDisplayMode] = useState("grid");
	const currentFilter = searchParams.get("filter") || "all";
	const currentSort = searchParams.get("sort") || "createdAt";
	const currentSearch = searchParams.get("q") || "";
	const currentSpecialization = searchParams.get("specialization") || "";
	const currentLocation = searchParams.get("location") || "";
	const currentAvailable = searchParams.get("available") || "";
	const debouncedSearch = useDebouncedValue(currentSearch, 400);
	const { data: lawyers, error: lawyersError, isLoading } = useLawyers({
		specialization: currentSpecialization || void 0,
		location: currentLocation || void 0,
		available: currentAvailable === "true" ? true : currentAvailable === "false" ? false : void 0,
		q: currentSearch || void 0
	});
	const sortLawyers = (lawyersToSort, sortValue) => {
		const sortOrder = sortValue.startsWith("-") ? "desc" : "asc";
		const sortField = sortValue.startsWith("-") ? sortValue.substring(1) : sortValue;
		return [...lawyersToSort].sort((a, b) => {
			let aValue = a[sortField];
			let bValue = b[sortField];
			if (typeof aValue === "string" && typeof bValue === "string") {
				aValue = aValue.toLowerCase();
				bValue = bValue.toLowerCase();
			}
			if (sortField === "createdAt") {
				aValue = new Date(aValue).getTime();
				bValue = new Date(bValue).getTime();
			}
			if (sortOrder === "asc") return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
			else return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
		});
	};
	const sortedLawyers = lawyers ? sortLawyers(lawyers, currentSort) : [];
	const handleFilterChange = (filterValue) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete("specialization");
		newParams.delete("location");
		newParams.delete("available");
		newParams.delete("filter");
		if (filterValue !== "all") newParams.set("filter", filterValue);
		setSearchParams(newParams);
	};
	const handleSpecializationChange = (specialization) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete("specialization");
		if (specialization) {
			newParams.set("specialization", specialization);
			newParams.set("filter", "specialization");
		}
		setSearchParams(newParams);
	};
	const handleLocationChange = (location) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete("location");
		if (location) {
			newParams.set("location", location);
			newParams.set("filter", "location");
		}
		setSearchParams(newParams);
	};
	const handleAvailableChange = (available) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete("available");
		if (available === "true" || available === "false") {
			newParams.set("available", available);
			newParams.set("filter", "isAvailable");
		}
		setSearchParams(newParams);
	};
	const handleSearchChange = (searchValue) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete("q");
		if (searchValue.trim()) newParams.set("q", searchValue.trim());
		setSearchParams(newParams);
	};
	useEffect(() => {
		if (debouncedSearch !== currentSearch) handleSearchChange(debouncedSearch);
	}, [debouncedSearch]);
	const handleSortChange = (sortBy, sortOrder) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete("sort");
		const sortValue = sortOrder === "desc" ? `-${sortBy}` : sortBy;
		newParams.set("sort", sortValue);
		setSearchParams(newParams);
	};
	const filterOptions = [
		{
			value: "all",
			label: "All Lawyers",
			icon: Users
		},
		{
			value: "specialization",
			label: "By Specialization",
			icon: Users
		},
		{
			value: "location",
			label: "By Location",
			icon: MapPin
		},
		{
			value: "isAvailable",
			label: "Available Now",
			icon: CheckCircle
		}
	];
	const sortOptions = [
		{
			value: "createdAt",
			label: "Most Recent"
		},
		{
			value: "name",
			label: "Name (A-Z)"
		},
		{
			value: "-name",
			label: "Name (Z-A)"
		}
	];
	const currentSortOrder = currentSort.startsWith("-") ? "desc" : "asc";
	const currentSortField = currentSort.startsWith("-") ? currentSort.substring(1) : currentSort;
	return /* @__PURE__ */ jsx(LawyersScreen, {
		lawyers: sortedLawyers,
		error: lawyersError,
		isLoading,
		isAuthenticated: !!user,
		displayMode,
		onDisplayModeChange: setDisplayMode,
		currentFilter,
		currentSpecialization,
		currentLocation,
		currentAvailable,
		currentSearch,
		filterOptions,
		onFilterChange: handleFilterChange,
		onSpecializationChange: handleSpecializationChange,
		onLocationChange: handleLocationChange,
		onAvailableChange: handleAvailableChange,
		onSearch: handleSearchChange,
		currentSortField,
		currentSortOrder,
		sortOptions,
		onSortChange: handleSortChange
	});
});
var ErrorBoundary$6 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/feature/lawyers/components/lawyer-bio.tsx
function LawyerBio({ bio, className = "" }) {
	return /* @__PURE__ */ jsx(CardWithLabel, {
		label: "Bio",
		className: cn("prose max-w-none", className),
		labelClassName: "text-xs font-mono text-gray-500",
		children: /* @__PURE__ */ jsx("p", {
			className: "text-gray-700 leading-relaxed",
			children: bio
		})
	});
}
//#endregion
//#region app/components/ui/stylized-list.tsx
function StylizedList({ items = [], className = "", itemClassName = "", defaultIcon: DefaultIcon, renderItem }) {
	return /* @__PURE__ */ jsx("ul", {
		className: cn("flex flex-col gap-2.5 text-sm", className),
		children: items.map((item, i) => {
			if (item === null || item === void 0) return null;
			let Icon = DefaultIcon;
			if (typeof item === "string") {} else if (item && typeof item === "object" && "text" in item) Icon = item.icon || DefaultIcon;
			else return /* @__PURE__ */ jsx("li", {
				className: itemClassName,
				children: item
			}, i);
			return /* @__PURE__ */ jsx("li", {
				className: cn("flex items-center gap-3 transition-colors hover:text-gray-900 group", itemClassName),
				children: renderItem ? renderItem(item) : /* @__PURE__ */ jsxs(Fragment, { children: [Icon && /* @__PURE__ */ jsx(IconContainer, {
					icon: Icon,
					size: "sm",
					color: "outline",
					className: "flex-shrink-0"
				}), /* @__PURE__ */ jsx("span", {
					className: "text-gray-600 group-hover:text-gray-900 leading-snug",
					children: typeof item === "string" ? item : item.text
				})] })
			}, i);
		})
	});
}
//#endregion
//#region app/feature/lawyers/components/LawyerEducation.tsx
var EducationSection = () => {
	return /* @__PURE__ */ jsx(CardWithLabel, {
		label: "Education",
		labelClassName: "text-xs font-mono text-gray-500",
		children: /* @__PURE__ */ jsx("div", {
			className: "py-2",
			children: /* @__PURE__ */ jsx(StylizedList, {
				items: [
					"LLM in International Human Rights Law - University of London (2015)",
					"LLB (Hons) - University of Nairobi (2011)",
					"Certificate in Criminal Justice - The Hague Academy (2013)"
				].map((text) => ({ text })),
				itemClassName: "group",
				defaultIcon: GraduationCap,
				renderItem: (item) => /* @__PURE__ */ jsx("span", {
					className: "text-gray-800 group-hover:text-gray-900",
					children: item.text
				})
			})
		})
	});
};
//#endregion
//#region app/feature/lawyers/screens/LawyerProfileScreen.tsx
var LawyerProfileScreen = ({ error, lawyer, isLoading }) => {
	if (isLoading) return /* @__PURE__ */ jsx(PageDetailsLoading, {
		title: "Loading Lawyer Profile",
		description: "Please wait while we load the lawyer's information...",
		skeletonCount: 2
	});
	if (error) return /* @__PURE__ */ jsx(PageDetailsError, {
		error,
		title: "Error Loading Lawyer Profile",
		description: "We couldn't load the lawyer profile. Please check your connection and try again.",
		onRetry: () => window.location.reload()
	});
	if (!lawyer) return /* @__PURE__ */ jsx(EmptyState, {
		title: "Profile Not Found",
		description: "We couldn't find the lawyer profile you're looking for.",
		className: "mx-auto",
		actions: [{
			label: "Back to Lawyers",
			href: "/lawyers",
			icon: /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 mr-2" }),
			variant: "default"
		}]
	});
	const handleContact = () => {};
	const getExperienceText = (years) => {
		if (!years) return "No experience info";
		if (years === 1) return "1 year";
		return `${years} years`;
	};
	const metadata = [];
	if (lawyer.specialization) metadata.push({
		icon: Scale,
		label: "Specialization",
		value: lawyer.specialization
	});
	if (lawyer.experienceYears) metadata.push({
		icon: Briefcase,
		label: "Experience",
		value: getExperienceText(lawyer.experienceYears)
	});
	if (lawyer.location) metadata.push({
		icon: MapPin,
		label: "Location",
		value: lawyer.location
	});
	const actions = [];
	if (handleContact) actions.push({
		label: "Contact Lawyer",
		icon: MapPin,
		onClick: handleContact,
		variant: "primary"
	});
	const breadcrumbs = [
		{
			label: "Home",
			to: "/",
			icon: Home
		},
		{
			label: "Lawyers",
			to: "/lawyers",
			icon: Users
		},
		{
			label: lawyer.name || "Lawyer Profile",
			to: `/lawyers/${lawyer.id}`
		}
	];
	const contactItems = [];
	if (lawyer.email) contactItems.push({
		type: "email",
		label: "Email Address",
		value: lawyer.email
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			breadcrumbs,
			className: "hidden sm:flex"
		}),
		/* @__PURE__ */ jsx(PageDetailHeader, {
			type: "Lawyer Profile",
			title: lawyer.name || "Lawyer Profile",
			description: lawyer.specialization || "Legal Professional",
			image: "https://picsum.photos/seed/lawyer-avatar/200/200.jpg",
			alt: `${lawyer.name} profile picture`,
			metadata,
			actions
		}),
		/* @__PURE__ */ jsx("div", {
			className: "mx-auto",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
				children: [/* @__PURE__ */ jsx("div", {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ jsx(LawyerBio, {
							bio: "No bio available for this lawyer.",
							className: "h-full"
						}), /* @__PURE__ */ jsx(EducationSection, {})]
					})
				}), /* @__PURE__ */ jsx(ContactInformation$1, {
					title: "",
					description: "",
					contactItems
				})]
			})
		})
	] });
};
//#endregion
//#region app/routes/lawyers/$lawyerId.tsx
var $lawyerId_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$5,
	default: () => $lawyerId_default,
	meta: () => meta$5
});
function meta$5({ params }) {
	const { lawyerId } = params;
	return [{ title: lawyerId ? `Lawyer Profile - Mahakama` : "Lawyer Profile - Mahakama" }, {
		name: "description",
		content: `View the profile of our legal expert. Contact for professional legal services.`
	}];
}
var $lawyerId_default = UNSAFE_withComponentProps(function LawyerProfile({ params }) {
	const { lawyerId } = params;
	const { data: lawyer, error, isLoading } = useLawyer(lawyerId || "");
	return /* @__PURE__ */ jsx(LawyerProfileScreen, {
		lawyer,
		error: null,
		isLoading: false
	});
});
var ErrorBoundary$5 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/lib/api/users.api.ts
var UsersApiClient = class {
	api;
	constructor(apiClient) {
		this.api = apiClient || new FetchApiClient();
	}
	async getCurrentUser() {
		const response = await this.api.request(`/v1/users/me`);
		if (!response.data.attributes) throw new Error("Invalid user data received from the server");
		return response.data.attributes;
	}
	async getUserById(userId) {
		const response = await this.api.request(`/v1/users/${userId}`);
		if (!response.data.attributes) throw new Error("Invalid user data received from the server");
		return response.data.attributes;
	}
	async updateUser(userId, data) {
		const response = await this.api.request(`/v1/users/${userId}`, {
			method: "PATCH",
			body: JSON.stringify(data)
		});
		if (!response.data.attributes) throw new Error("Invalid user data received from the server");
		return response.data.attributes;
	}
};
var usersApi = new UsersApiClient();
//#endregion
//#region app/feature/users/hooks/use-users.ts
var userKeys = {
	all: ["users"],
	lists: () => [...userKeys.all, "list"],
	list: (filters) => [...userKeys.lists(), { filters }],
	details: () => [...userKeys.all, "detail"],
	detail: (id) => [...userKeys.details(), id],
	current: () => [...userKeys.all, "current"]
};
function useCurrentUser() {
	return useQuery({
		queryKey: userKeys.current(),
		queryFn: async () => {
			return await usersApi.getCurrentUser();
		},
		staleTime: 6e5,
		meta: { errorToast: false }
	});
}
function useUpdateUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ userId, data }) => {
			return await usersApi.updateUser(userId, data);
		},
		onSuccess: (data, variables) => {
			toast.success("Profile updated successfully!");
			queryClient.invalidateQueries({ queryKey: userKeys.current() });
			if (data.isOnboarded) window.location.href = "/app";
		},
		onError: (error) => {
			toast.error("Failed to update profile. Please try again.");
			console.error("Update error:", error);
		}
	});
}
//#endregion
//#region app/feature/users/components/basic-info-section.tsx
function BasicInfoSection({ formData, onInputChange }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "grid md:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: "name",
					className: "block text-sm font-bold text-gray-700",
					children: "Full Name *"
				}), /* @__PURE__ */ jsx(Input, {
					id: "name",
					value: formData.name,
					onChange: (e) => onInputChange("name", e.target.value),
					placeholder: "Enter your full name",
					className: "border-2 border-gray-900"
				})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: "age",
					className: "block text-sm font-bold text-gray-700",
					children: "Age"
				}), /* @__PURE__ */ jsx(Input, {
					id: "age",
					type: "number",
					value: formData.age,
					onChange: (e) => onInputChange("age", e.target.value),
					placeholder: "Your age",
					className: "border-2 border-gray-900"
				})] })]
			}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
				htmlFor: "gender",
				className: "block text-sm font-bold text-gray-700",
				children: "Gender"
			}), /* @__PURE__ */ jsxs(Select, {
				value: formData.gender,
				onValueChange: (value) => onInputChange("gender", value),
				children: [/* @__PURE__ */ jsx(SelectTrigger, {
					className: "border-2 border-gray-900",
					children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select gender" })
				}), /* @__PURE__ */ jsxs(SelectContent, { children: [
					/* @__PURE__ */ jsx(SelectItem, {
						value: "male",
						children: "Male"
					}),
					/* @__PURE__ */ jsx(SelectItem, {
						value: "female",
						children: "Female"
					}),
					/* @__PURE__ */ jsx(SelectItem, {
						value: "other",
						children: "Other"
					}),
					/* @__PURE__ */ jsx(SelectItem, {
						value: "non_binary",
						children: "Non-binary"
					}),
					/* @__PURE__ */ jsx(SelectItem, {
						value: "prefer_not_to_say",
						children: "Prefer not to say"
					})
				] })]
			})] })]
		}), /* @__PURE__ */ jsx("div", {
			className: "space-y-4",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid md:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: "country",
					className: "block text-sm font-bold text-gray-700",
					children: "Country"
				}), /* @__PURE__ */ jsx(Input, {
					id: "country",
					value: formData.country || "",
					onChange: (e) => onInputChange("country", e.target.value),
					placeholder: "Your country",
					className: "border-2 border-gray-900"
				})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
					htmlFor: "city",
					className: "block text-sm font-bold text-gray-700",
					children: "City"
				}), /* @__PURE__ */ jsx(Input, {
					id: "city",
					value: formData.city || "",
					onChange: (e) => onInputChange("city", e.target.value),
					placeholder: "Your city",
					className: "border-2 border-gray-900"
				})] })]
			})
		})]
	});
}
//#endregion
//#region app/feature/users/components/location-section.tsx
function LocationSection({ formData, onInputChange }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ jsxs("h2", {
			className: "text-xl font-semibold text-gray-900 flex items-center gap-2",
			children: [/* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5" }), "Location"]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid md:grid-cols-2 gap-4",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
				htmlFor: "country",
				children: "Country"
			}), /* @__PURE__ */ jsx(Input, {
				id: "country",
				value: formData.country,
				onChange: (e) => onInputChange("country", e.target.value),
				placeholder: "Your country",
				className: "border-2 border-gray-900"
			})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
				htmlFor: "city",
				children: "City"
			}), /* @__PURE__ */ jsx(Input, {
				id: "city",
				value: formData.city,
				onChange: (e) => onInputChange("city", e.target.value),
				placeholder: "Your city",
				className: "border-2 border-gray-900"
			})] })]
		})]
	});
}
//#endregion
//#region app/feature/users/components/contact-section.tsx
function ContactSection({ formData, onInputChange }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ jsxs("h2", {
			className: "text-xl font-semibold text-gray-900 flex items-center gap-2",
			children: [/* @__PURE__ */ jsx(Phone, { className: "h-5 w-5" }), "Contact"]
		}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
			htmlFor: "phoneNumber",
			children: "Phone Number"
		}), /* @__PURE__ */ jsx(Input, {
			id: "phoneNumber",
			type: "tel",
			value: formData.phoneNumber,
			onChange: (e) => onInputChange("phoneNumber", e.target.value),
			placeholder: "+256 123 456 789",
			className: "border-2 border-gray-900"
		})] })]
	});
}
//#endregion
//#region app/feature/users/components/professional-section.tsx
function ProfessionalSection({ formData, onInputChange }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ jsxs("h2", {
			className: "text-xl font-semibold text-gray-900 flex items-center gap-2",
			children: [/* @__PURE__ */ jsx(Briefcase, { className: "h-5 w-5" }), "Professional"]
		}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
			htmlFor: "occupation",
			children: "Occupation"
		}), /* @__PURE__ */ jsx(Input, {
			id: "occupation",
			value: formData.occupation,
			onChange: (e) => onInputChange("occupation", e.target.value),
			placeholder: "Your occupation",
			className: "border-2 border-gray-900"
		})] })]
	});
}
//#endregion
//#region app/feature/users/components/bio-section.tsx
function BioSection({ formData, onInputChange }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ jsxs("h2", {
			className: "text-xl font-semibold text-gray-900 flex items-center gap-2",
			children: [/* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }), "About You"]
		}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, {
			htmlFor: "bio",
			className: "block text-sm font-bold text-gray-700",
			children: "Bio"
		}), /* @__PURE__ */ jsx(Textarea, {
			id: "bio",
			value: formData.bio,
			onChange: (e) => onInputChange("bio", e.target.value),
			placeholder: "Tell us a bit about yourself...",
			rows: 4,
			className: "border-2 border-gray-900 resize-none"
		})] })]
	});
}
//#endregion
//#region app/feature/users/components/RoleSelector.tsx
function RoleSelector({ onRoleSelect, selectedRole }) {
	const [role, setRole] = useState(selectedRole);
	const [isAnimating, setIsAnimating] = useState(false);
	const handleRoleSelect = (selectedRole) => {
		setRole(selectedRole);
		setIsAnimating(true);
		setTimeout(() => setIsAnimating(false), 300);
		onRoleSelect(selectedRole);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 gap-6 mb-8 max-w-2xl mx-auto",
			children: [{
				id: "user",
				title: "I'm a Citizen",
				description: "Looking for legal help",
				icon: UserCircle
			}, {
				id: "lawyer",
				title: "I'm a Legal Professional",
				description: "Here to offer services",
				icon: Briefcase
			}].map((roleConfig) => /* @__PURE__ */ jsx("div", {
				onClick: () => handleRoleSelect(roleConfig.id),
				className: `relative transition-all duration-300 cursor-pointer ${role === roleConfig.id ? "scale-105" : ""} ${isAnimating && role === roleConfig.id ? "animate-pulse" : ""}`,
				children: /* @__PURE__ */ jsx(CardWithLabel, {
					label: `${roleConfig.id}-role`,
					className: `bg-white rounded-xl border-2 border-solid transition-all duration-300 ${role === roleConfig.id ? "border-yellow-400 shadow-[6px_6px_0_0_#FDE047]" : "border-gray-900 hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1"}`,
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col md:flex-row md:items-center gap-4 mb-4",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex justify-center md:justify-start",
							children: /* @__PURE__ */ jsx(IconContainer, {
								icon: roleConfig.icon,
								size: "lg",
								color: "outline",
								className: "flex-shrink-0"
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-center md:text-left",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "text-2xl font-bold text-gray-900 mb-2",
								children: roleConfig.title
							}), /* @__PURE__ */ jsx("p", {
								className: "text-sm text-gray-600",
								children: roleConfig.description
							})]
						})]
					})
				})
			}, roleConfig.id))
		}), /* @__PURE__ */ jsx("p", {
			className: "text-center text-sm text-gray-500 mt-6",
			children: "Select your role to get started"
		})]
	});
}
//#endregion
//#region app/feature/users/components/UserProfileForm.tsx
var UserProfileForm = ({ user, updateMutation, mode = "edit", submitText, loadingText, className = "", onSubmit }) => {
	const [formData, setFormData] = useState({
		name: user.name || "",
		age: user.age?.toString() || "",
		gender: user.gender || "",
		country: user.country || "",
		city: user.city || "",
		phoneNumber: user.phoneNumber || "",
		occupation: user.occupation || "",
		bio: user.bio || ""
	});
	useEffect(() => {
		setFormData({
			name: user.name || "",
			age: user.age?.toString() || "",
			gender: user.gender || "",
			country: user.country || "",
			city: user.city || "",
			phoneNumber: user.phoneNumber || "",
			occupation: user.occupation || "",
			bio: user.bio || ""
		});
	}, [user]);
	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value
		}));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name.trim()) {
			alert("Name is required");
			return;
		}
		const updateData = {
			name: formData.name.trim(),
			age: formData.age ? parseInt(formData.age, 10) : null,
			gender: formData.gender,
			country: formData.country.trim() || null,
			city: formData.city.trim() || null,
			phoneNumber: formData.phoneNumber.trim() || null,
			occupation: formData.occupation.trim() || null,
			bio: formData.bio.trim() || null,
			role: user.role || null
		};
		if (mode === "onboarding") updateData.isOnboarded = true;
		updateMutation.mutate({
			userId: user.id,
			data: updateData
		});
		onSubmit?.();
	};
	const defaultSubmitText = mode === "onboarding" ? "Complete Profile" : "Update Profile";
	const defaultLoadingText = mode === "onboarding" ? "Completing Profile..." : "Updating Profile...";
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: handleSubmit,
		className: `space-y-6 ${className}`,
		children: [
			/* @__PURE__ */ jsx(BasicInfoSection, {
				formData: {
					name: formData.name,
					age: formData.age,
					gender: formData.gender
				},
				onInputChange: handleInputChange
			}),
			/* @__PURE__ */ jsx(LocationSection, {
				formData: {
					country: formData.country,
					city: formData.city
				},
				onInputChange: handleInputChange
			}),
			/* @__PURE__ */ jsx(ContactSection, {
				formData: { phoneNumber: formData.phoneNumber },
				onInputChange: handleInputChange
			}),
			user.role === "lawyer" && /* @__PURE__ */ jsx(ProfessionalSection, {
				formData: { occupation: formData.occupation },
				onInputChange: handleInputChange
			}),
			/* @__PURE__ */ jsx(BioSection, {
				formData: { bio: formData.bio },
				onInputChange: handleInputChange
			}),
			/* @__PURE__ */ jsx("div", {
				className: "pt-6",
				children: /* @__PURE__ */ jsx(Button, {
					type: "submit",
					disabled: updateMutation.isPending,
					className: "w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
					children: updateMutation.isPending ? loadingText || defaultLoadingText : submitText || defaultSubmitText
				})
			})
		]
	});
};
//#endregion
//#region app/feature/users/components/ProfileHeader.tsx
var ProfileHeader = ({ user, onEditProfile }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "mb-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "md:hidden flex flex-col items-center gap-4",
			children: [
				/* @__PURE__ */ jsx(Avatar, {
					className: "h-20 w-20 border-4 border-foreground",
					children: user?.avatar ? /* @__PURE__ */ jsx(AvatarImage, {
						src: user.avatar,
						alt: "Profile"
					}) : /* @__PURE__ */ jsx(AvatarFallback, {
						className: "text-2xl font-bold bg-background",
						children: user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "text-center",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-1 flex items-center justify-center gap-3",
						children: [/* @__PURE__ */ jsx(User, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ jsx("h1", {
							className: "text-2xl font-bold",
							children: user?.name || user?.email || "User"
						})]
					}), /* @__PURE__ */ jsxs("p", {
						className: "flex items-center justify-center gap-2 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full border border-muted-foreground" }),
							user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User",
							" ",
							"Account"
						]
					})]
				}),
				/* @__PURE__ */ jsxs(Button, {
					variant: "outline",
					size: "sm",
					className: "gap-2 bg-transparent",
					onClick: onEditProfile,
					children: [/* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }), "Edit Profile"]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "hidden md:flex items-start justify-between",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-6",
				children: [/* @__PURE__ */ jsx(Avatar, {
					className: "h-20 w-20 border-4 border-foreground",
					children: user?.avatar ? /* @__PURE__ */ jsx(AvatarImage, {
						src: user.avatar,
						alt: "Profile"
					}) : /* @__PURE__ */ jsx(AvatarFallback, {
						className: "text-2xl font-bold bg-background",
						children: user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"
					})
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-1 flex items-center gap-3",
					children: [/* @__PURE__ */ jsx(User, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold",
						children: user?.name || user?.email || "User"
					})]
				}), /* @__PURE__ */ jsxs("p", {
					className: "flex items-center gap-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full border border-muted-foreground" }),
						user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User",
						" ",
						"Account"
					]
				})] })]
			}), /* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				className: "gap-2 bg-transparent",
				onClick: onEditProfile,
				children: [/* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }), "Edit Profile"]
			})]
		})]
	});
};
//#endregion
//#region app/feature/users/components/ContactInformation.tsx
var ContactInformation = ({ user }) => {
	const contactItems = [{
		type: "email",
		label: "Email Address",
		value: user?.email || "Not provided"
	}];
	if (user?.phoneNumber) contactItems.push({
		type: "phone",
		label: "Phone Number",
		value: user.phoneNumber
	});
	if (user?.city || user?.country) contactItems.push({
		type: "location",
		label: "Location",
		value: [user.city, user.country].filter(Boolean).join(", ") || "Not provided"
	});
	contactItems.push({
		type: "date",
		label: "Member Since",
		value: formatDate$1(user?.createdAt || "")
	});
	return /* @__PURE__ */ jsx(ContactInformation$1, {
		title: "Contact Information",
		description: "Your current contact details and account information.",
		contactItems
	});
};
//#endregion
//#region app/components/ui/tabs.tsx
function Tabs({ className, ...props }) {
	return /* @__PURE__ */ jsx(TabsPrimitive.Root, {
		"data-slot": "tabs",
		className: cn("flex flex-col gap-2", className),
		...props
	});
}
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ jsx(TabsPrimitive.List, {
		"data-slot": "tabs-list",
		className: cn("bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ jsx(TabsPrimitive.Trigger, {
		"data-slot": "tabs-trigger",
		className: cn("data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ jsx(TabsPrimitive.Content, {
		"data-slot": "tabs-content",
		className: cn("flex-1 outline-none", className),
		...props
	});
}
//#endregion
//#region app/feature/users/components/ProfileTabs.tsx
var ProfileTabs = ({ activeTab, onTabChange, children }) => {
	return /* @__PURE__ */ jsxs(Tabs, {
		value: activeTab,
		onValueChange: (value) => onTabChange(value),
		className: "w-full",
		children: [
			/* @__PURE__ */ jsxs(TabsList, {
				className: "bg-transparent border-b-2 border-gray-900 rounded-none h-auto p-0 gap-0",
				children: [/* @__PURE__ */ jsxs(TabsTrigger, {
					value: "personal",
					className: "pb-3 text-sm font-bold transition-colors px-4 py-2 -mb-px flex items-center gap-2 rounded-t-lg data-[state=active]:border-2 data-[state=active]:border-gray-900 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-900 data-[state=active]:border-b-0 data-[state=active]:shadow-[-2px_-2px_0_0_#000] border-r-0",
					style: { borderRadius: "8px 8px 0 0" },
					children: [/* @__PURE__ */ jsx(User, { className: "w-4 h-4" }), "Personal Information"]
				}), /* @__PURE__ */ jsxs(TabsTrigger, {
					value: "account",
					className: "pb-3 text-sm font-bold transition-colors px-4 py-2 -mb-px flex items-center gap-2 rounded-t-lg data-[state=active]:border-2 data-[state=active]:border-gray-900 data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-900 data-[state=active]:border-b-0 data-[state=active]:shadow-[-2px_-2px_0_0_#000]",
					style: { borderRadius: "8px 8px 0 0" },
					children: [/* @__PURE__ */ jsx(Bookmark, { className: "w-4 h-4" }), "Saved Items"]
				})]
			}),
			/* @__PURE__ */ jsx(TabsContent, {
				value: "personal",
				className: "mt-0",
				children
			}),
			/* @__PURE__ */ jsx(TabsContent, {
				value: "account",
				className: "mt-0",
				children
			})
		]
	});
};
//#endregion
//#region app/components/saved-items.tsx
var iconMap = {
	lawyer: User,
	document: FileText
};
var iconColorMap = {
	lawyer: "text-blue-600",
	document: "text-green-600"
};
function SavedItems({ title = "Saved Items", description, savedItems, className = "" }) {
	const [showDropdown, setShowDropdown] = useState(null);
	const getIcon = (type, customIcon) => {
		if (customIcon) return customIcon;
		return iconMap[type];
	};
	const getIconColor = (type) => {
		return iconColorMap[type];
	};
	const renderContent = (item) => {
		if (item.href) return /* @__PURE__ */ jsx("a", {
			href: item.href,
			className: "text-blue-600 hover:text-blue-800 underline font-semibold",
			children: item.title
		});
		return /* @__PURE__ */ jsx("p", {
			className: "text-base font-semibold",
			children: item.title
		});
	};
	const handleShare = (item, index) => {
		if (item.onShare) item.onShare();
		setShowDropdown(null);
	};
	const handleDelete = (item, index) => {
		if (item.onDelete) item.onDelete();
		setShowDropdown(null);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: `space-y-6 ${className}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-2",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "text-lg font-semibold text-gray-900",
				children: title
			}), description && /* @__PURE__ */ jsx("p", {
				className: "text-sm text-gray-500",
				children: description
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "space-y-4",
			children: savedItems.map((item, index) => {
				const Icon = getIcon(item.type, item.icon);
				const iconColor = getIconColor(item.type);
				return /* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 bg-white px-4 py-3 rounded-lg border-2 border-gray-900",
						style: { boxShadow: "2px 2px 0 0 #000" },
						children: [
							/* @__PURE__ */ jsx(Icon, { className: `w-5 h-5 ${iconColor}` }),
							/* @__PURE__ */ jsxs("div", {
								className: "flex-1",
								children: [
									/* @__PURE__ */ jsx("p", {
										className: "text-sm font-medium text-gray-500",
										children: item.description
									}),
									renderContent(item),
									/* @__PURE__ */ jsxs("p", {
										className: "text-xs text-gray-400 mt-1",
										children: ["Saved ", item.savedDate]
									})
								]
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: () => setShowDropdown(showDropdown === index ? null : index),
								className: "p-1 rounded hover:bg-gray-100 transition-colors",
								"aria-label": "More options",
								children: /* @__PURE__ */ jsx(MoreVertical, { className: "w-4 h-4 text-gray-500" })
							})
						]
					}), showDropdown === index && /* @__PURE__ */ jsxs("div", {
						className: "absolute right-2 top-12 bg-white border-2 border-gray-900 rounded-lg shadow-lg z-10",
						style: { boxShadow: "2px 2px 0 0 #000" },
						children: [/* @__PURE__ */ jsxs("button", {
							onClick: () => handleShare(item, index),
							className: "flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
							children: [/* @__PURE__ */ jsx(Share, { className: "w-4 h-4" }), "Share"]
						}), /* @__PURE__ */ jsxs("button", {
							onClick: () => handleDelete(item, index),
							className: "flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors",
							children: [/* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }), "Delete"]
						})]
					})]
				}, index);
			})
		})]
	});
}
//#endregion
//#region app/feature/users/screens/ProfileScreen.tsx
var ProfileScreen = ({ user, updateMutation }) => {
	const [activeTab, setActiveTab] = useState("personal");
	const [isEditing, setIsEditing] = useState(false);
	const savedItems = [
		{
			type: "lawyer",
			title: "John Smith",
			description: "Criminal Defense Lawyer",
			savedDate: "2 days ago",
			href: "/lawyers/1",
			onShare: () => alert("Sharing John Smith profile"),
			onDelete: () => alert("Deleting John Smith profile")
		},
		{
			type: "lawyer",
			title: "Sarah Johnson",
			description: "Family Law Specialist",
			savedDate: "1 week ago",
			href: "/lawyers/2",
			onShare: () => alert("Sharing Sarah Johnson profile"),
			onDelete: () => alert("Deleting Sarah Johnson profile")
		},
		{
			type: "document",
			title: "Contract Agreement Template",
			description: "Legal Document",
			savedDate: "3 days ago",
			href: "/documents/contract-template",
			onShare: () => alert("Sharing Contract Agreement Template"),
			onDelete: () => alert("Deleting Contract Agreement Template")
		},
		{
			type: "document",
			title: "Tenant Rights Guide",
			description: "Legal Guide",
			savedDate: "2 weeks ago",
			href: "/documents/tenant-rights",
			onShare: () => alert("Sharing Tenant Rights Guide"),
			onDelete: () => alert("Deleting Tenant Rights Guide")
		},
		{
			type: "lawyer",
			title: "Michael Davis",
			description: "Corporate Attorney",
			savedDate: "1 month ago",
			href: "/lawyers/3",
			onShare: () => alert("Sharing Michael Davis profile"),
			onDelete: () => alert("Deleting Michael Davis profile")
		}
	];
	const handleEditProfile = () => {
		setIsEditing(true);
	};
	const handleCancel = () => {
		setIsEditing(false);
	};
	const handleFormSubmit = () => {
		setIsEditing(false);
	};
	if (isEditing) return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl p-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-8 flex items-center justify-between",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "text-2xl font-bold",
				children: "Edit Your Profile"
			}), /* @__PURE__ */ jsx(Button, {
				onClick: handleCancel,
				variant: "outline",
				size: "sm",
				className: "gap-2",
				children: "Cancel"
			})]
		}), /* @__PURE__ */ jsx(UserProfileForm, {
			user,
			updateMutation,
			mode: "edit",
			onSubmit: handleFormSubmit
		})]
	});
	return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(ProfileTabs, {
			activeTab,
			onTabChange: setActiveTab
		}),
		activeTab === "personal" && /* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsx(ProfileHeader, {
				user,
				onEditProfile: handleEditProfile
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mb-8 bg-white rounded-xl border-2 border-gray-900 p-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-lg font-semibold text-gray-900 mb-4",
					children: "About Me"
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [
						user?.age && /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm font-medium text-gray-600",
								children: "Age:"
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-sm text-gray-900",
								children: [user.age, " years old"]
							})]
						}),
						user?.gender && /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm font-medium text-gray-600",
								children: "Gender:"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-sm text-gray-900",
								children: user.gender.charAt(0).toUpperCase() + user.gender.slice(1).replace("_", " ")
							})]
						}),
						user?.occupation && /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm font-medium text-gray-600",
								children: "Occupation:"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-sm text-gray-900",
								children: user.occupation
							})]
						}),
						user?.bio && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm font-medium text-gray-600",
							children: "Bio:"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-gray-900 mt-1",
							children: user.bio
						})] }),
						!user?.age && !user?.gender && !user?.occupation && !user?.bio && /* @__PURE__ */ jsx("p", {
							className: "text-sm text-gray-500 italic",
							children: "No additional information provided yet."
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(ContactInformation, { user })
		] }),
		activeTab === "account" && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(SavedItems, {
			title: "Bookmarks & Saved Items",
			description: "Your saved lawyers and legal documents for quick access.",
			savedItems
		}) })
	] }) });
};
//#endregion
//#region app/routes/users/$profile.tsx
var $profile_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$4,
	default: () => $profile_default,
	loader: () => loader$3,
	meta: () => meta$4
});
function meta$4({ loaderData }) {
	const { user } = loaderData;
	return [{ title: `${user?.name || "Profile"} - Mahakama` }, {
		name: "description",
		content: user?.bio || "View your Mahakama profile and account details"
	}];
}
async function loader$3({ context, request }) {
	const token = context.get(authContext)?.token || null;
	try {
		const cookieHeader = request.headers.get("cookie");
		return {
			token,
			user: await (cookieHeader ? new UsersApiClient(new FetchApiClient({ Cookie: cookieHeader })) : usersApi).getCurrentUser()
		};
	} catch (error) {
		handleRouteError(error, "Failed to load user profile");
	}
}
var $profile_default = UNSAFE_withComponentProps(function ProfilePage({ loaderData }) {
	const { token } = loaderData;
	const { data: user, isLoading, error } = useCurrentUser();
	const updateMutation = useUpdateUser();
	return /* @__PURE__ */ jsx(ProfileScreen, {
		user,
		updateMutation
	});
});
var ErrorBoundary$4 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/feature/users/components/AccountManagement.tsx
var AccountManagement = ({ user, onLogout }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsx(CardWithLabel, {
			label: "Account Information",
			labelClassName: "bg-yellow-100 text-yellow-800 font-bold",
			children: /* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-blue-600" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "text-sm font-medium text-gray-500",
							children: "Account Type"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-lg font-semibold text-gray-900",
							children: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx(CreditCard, { className: "w-5 h-5 text-green-600" }), /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium text-gray-500",
								children: "Subscription"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-lg font-semibold text-gray-900",
								children: "Free Tier"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm text-gray-600",
								children: "Upgrade to Premium for additional features"
							})
						] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx(Settings, { className: "w-5 h-5 text-purple-600" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "text-sm font-medium text-gray-500",
							children: "Account Status"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-lg font-semibold text-gray-900",
							children: user?.isOnboarded ? "Active" : "Setup Required"
						})] })]
					})
				]
			})
		}), /* @__PURE__ */ jsx(CardWithLabel, {
			label: "Account Actions",
			labelClassName: "bg-red-100 text-red-800 font-bold",
			children: /* @__PURE__ */ jsx("div", {
				className: "space-y-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							className: "w-full justify-start gap-3 border-2 border-gray-900 hover:bg-gray-50",
							style: { boxShadow: "2px 2px 0 0 #000" },
							children: [/* @__PURE__ */ jsx(Settings, { className: "w-4 h-4" }), "Account Settings"]
						}),
						/* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							className: "w-full justify-start gap-3 border-2 border-gray-900 hover:bg-gray-50",
							style: { boxShadow: "2px 2px 0 0 #000" },
							children: [/* @__PURE__ */ jsx(CreditCard, { className: "w-4 h-4" }), "Billing & Subscription"]
						}),
						/* @__PURE__ */ jsxs(Button, {
							onClick: onLogout,
							className: "w-full justify-start gap-3 bg-red-500 hover:bg-red-600 text-white border-2 border-red-700",
							style: { boxShadow: "2px 2px 0 0 #000" },
							children: [/* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }), "Log Out"]
						})
					]
				})
			})
		})]
	});
};
//#endregion
//#region app/feature/users/screens/SettingsScreen.tsx
var SettingsScreen = ({ user, token, updateMutation }) => {
	const [activeTab, setActiveTab] = useState("personal");
	const [isEditing, setIsEditing] = useState(false);
	const handleEditProfile = () => {
		setIsEditing(true);
	};
	const handleCancel = () => {
		setIsEditing(false);
	};
	const handleFormSubmit = () => {
		setIsEditing(false);
	};
	const handleLogout = () => {
		console.log("Logging out...");
	};
	if (isEditing) return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl p-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-8 flex items-center justify-between",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "text-2xl font-bold",
				children: "Edit Your Profile"
			}), /* @__PURE__ */ jsx(Button, {
				onClick: handleCancel,
				variant: "outline",
				size: "sm",
				className: "gap-2",
				children: "Cancel"
			})]
		}), /* @__PURE__ */ jsx(UserProfileForm, {
			user,
			updateMutation,
			mode: "edit",
			onSubmit: handleFormSubmit
		})]
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(ProfileTabs, {
			activeTab,
			onTabChange: setActiveTab
		}),
		activeTab === "personal" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(ProfileHeader, {
			user,
			onEditProfile: handleEditProfile
		}), /* @__PURE__ */ jsx(ContactInformation, { user })] }),
		activeTab === "account" && /* @__PURE__ */ jsx(AccountManagement, {
			user,
			onLogout: handleLogout
		})
	] });
};
//#endregion
//#region app/routes/users/settings.tsx
var settings_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$3,
	default: () => settings_default,
	loader: () => loader$2,
	meta: () => meta$3
});
function meta$3({}) {
	return [{ title: "Settings - Mahakama" }, {
		name: "description",
		content: "Settings page for Mahakama account to access your legal resources and history."
	}];
}
async function loader$2({ context }) {
	try {
		const user = context.get(userContext);
		const token = context.get(authContext)?.token || null;
		if (!user || !token) throw new Response("User not authenticated", { status: 401 });
		return {
			user,
			token,
			error: null
		};
	} catch (error) {
		handleRouteError(error, "Failed to load mahakama");
	}
}
var settings_default = UNSAFE_withComponentProps(function SettingsPage({ loaderData }) {
	const { user, token } = loaderData;
	const updateMutation = useUpdateUser();
	return /* @__PURE__ */ jsx(SettingsScreen, {
		user,
		token,
		updateMutation
	});
});
var ErrorBoundary$3 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/feature/chats/components/ListConversations.tsx
var ListConversations = () => {
	const chats = Array.from({ length: 20 }, (_, i) => ({
		id: `chat-${i + 1}`,
		userId: `user-${i % 3 + 1}`,
		title: `Legal Consultation ${i + 1}`,
		metadata: {},
		updatedAt: (/* @__PURE__ */ new Date(Date.now() - i * 36e5)).toISOString(),
		createdAt: (/* @__PURE__ */ new Date(Date.now() - i * 36e5 - 864e5)).toISOString()
	}));
	const handleRename = (chatId, newTitle) => {
		console.log(`Renaming chat ${chatId} to: ${newTitle}`);
	};
	const handleDelete = (chatId) => {
		console.log(`Deleting chat: ${chatId}`);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "bg-gradient-to-br from-blue-50 to-indigo-100 p-8",
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-4xl mx-auto",
			children: /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-lg shadow-xl p-6",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-gray-800 mb-6",
					children: "Conversations"
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-4",
					children: chats.map((chat) => /* @__PURE__ */ jsx(ChatItem, {
						chat,
						onRename: (newTitle) => handleRename(chat.id, newTitle),
						onDelete: () => handleDelete(chat.id)
					}, chat.id))
				})]
			})
		})
	});
};
//#endregion
//#region app/feature/chats/screens/Messages.tsx
var MessagesScreens = () => {
	return /* @__PURE__ */ jsx(ListConversations, {});
};
//#endregion
//#region app/routes/messages/index.tsx
var messages_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$2,
	default: () => messages_default,
	meta: () => meta$2
});
function meta$2({}) {
	return [{ title: "Messages - Mahakama" }, {
		name: "description",
		content: "View your legal consultations and messages"
	}];
}
var messages_default = UNSAFE_withComponentProps(function MessagesPage() {
	return /* @__PURE__ */ jsx(MessagesScreens, {});
});
var ErrorBoundary$2 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/feature/chats/screens/ConversationScreen.tsx
var ConversationScreen = () => {
	return /* @__PURE__ */ jsx("p", { children: "Conversation" });
};
//#endregion
//#region app/routes/messages/conversationId.tsx
var conversationId_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$1,
	default: () => conversationId_default,
	meta: () => meta$1
});
function meta$1({}) {
	return [{ title: "Conversation - Mahakama" }, {
		name: "description",
		content: "View a legal consultation conversation"
	}];
}
var conversationId_default = UNSAFE_withComponentProps(function ConversationPage() {
	return /* @__PURE__ */ jsx(ConversationScreen, {});
});
var ErrorBoundary$1 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/feature/users/components/BasicInfoStep.tsx
function BasicInfoStep({ user, onNext, initialData, formRef }) {
	const [formData, setFormData] = useState({
		name: initialData?.name || user.name || "",
		age: initialData?.age || user.age?.toString() || "",
		gender: initialData?.gender || user.gender || "",
		country: initialData?.country || user.country || "",
		city: initialData?.city || user.city || ""
	});
	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value
		}));
	};
	const handleSubmit = (e) => {
		console.log("BasicInfoStep handleSubmit called");
		e.preventDefault();
		if (!formData.name.trim()) {
			alert("Name is required");
			return;
		}
		if (!formData.age.trim() || isNaN(parseInt(formData.age, 10))) {
			alert("Valid age is required");
			return;
		}
		if (!formData.gender) {
			alert("Gender selection is required");
			return;
		}
		console.log("BasicInfoStep calling onNext with:", formData);
		onNext(formData);
	};
	return /* @__PURE__ */ jsx("form", {
		ref: formRef,
		onSubmit: handleSubmit,
		className: "space-y-6",
		children: /* @__PURE__ */ jsx(BasicInfoSection, {
			formData: {
				name: formData.name,
				age: formData.age,
				gender: formData.gender,
				country: formData.country,
				city: formData.city
			},
			onInputChange: handleInputChange
		})
	});
}
//#endregion
//#region app/feature/users/components/LawyerBasicInfoStep.tsx
function LawyerBasicInfoStep({ user, onNext, initialData, formRef }) {
	const [formData, setFormData] = useState({
		name: initialData?.name || user.name || "",
		age: initialData?.age || user.age?.toString() || "",
		gender: initialData?.gender || user.gender || "",
		country: initialData?.country || user.country || "",
		city: initialData?.city || user.city || ""
	});
	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value
		}));
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.name.trim()) {
			alert("Name is required");
			return;
		}
		onNext(formData);
	};
	return /* @__PURE__ */ jsx("form", {
		ref: formRef,
		onSubmit: handleSubmit,
		className: "space-y-6",
		children: /* @__PURE__ */ jsx(BasicInfoSection, {
			formData: {
				name: formData.name,
				age: formData.age,
				gender: formData.gender,
				country: formData.country,
				city: formData.city
			},
			onInputChange: handleInputChange
		})
	});
}
//#endregion
//#region app/feature/users/components/LawyerProfessionalInfoStep.tsx
var lawyerProfessionalSchema = z.object({
	specialization: z.string().min(1, "Specialization is required"),
	experienceYears: z.string().min(1, "Years of experience is required"),
	casesHandled: z.string().min(1, "Cases handled is required")
});
function LawyerProfessionalInfoStep({ user, onNext, initialData, formRef }) {
	const form = useForm({
		resolver: zodResolver(lawyerProfessionalSchema),
		defaultValues: {
			specialization: initialData?.specialization || "",
			experienceYears: initialData?.experienceYears || "",
			casesHandled: initialData?.casesHandled || ""
		}
	});
	return /* @__PURE__ */ jsxs(Form, {
		...form,
		children: [
			/* @__PURE__ */ jsx(FormField, {
				control: form.control,
				name: "specialization",
				render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
					/* @__PURE__ */ jsx(FormLabel, {
						className: "block text-sm font-bold text-gray-700 mb-1",
						children: "Specialization *"
					}),
					/* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, {
						...field,
						id: "specialization",
						className: "border-2 border-gray-900",
						style: {
							boxShadow: "2px 2px 0 0 #000",
							borderRadius: "4px 8px 4px 8px"
						}
					}) }),
					/* @__PURE__ */ jsx(FormMessage, {})
				] })
			}),
			/* @__PURE__ */ jsx(FormField, {
				control: form.control,
				name: "experienceYears",
				render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
					/* @__PURE__ */ jsx(FormLabel, {
						className: "block text-sm font-bold text-gray-700 mb-1",
						children: "Years of Experience *"
					}),
					/* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, {
						...field,
						id: "experienceYears",
						type: "number",
						className: "border-2 border-gray-900",
						style: {
							boxShadow: "2px 2px 0 0 #000",
							borderRadius: "4px 8px 4px 8px"
						}
					}) }),
					/* @__PURE__ */ jsx(FormMessage, {})
				] })
			}),
			/* @__PURE__ */ jsx(FormField, {
				control: form.control,
				name: "casesHandled",
				render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
					/* @__PURE__ */ jsx(FormLabel, {
						className: "block text-sm font-bold text-gray-700 mb-1",
						children: "Cases Handled *"
					}),
					/* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, {
						...field,
						id: "casesHandled",
						className: "border-2 border-gray-900",
						style: {
							boxShadow: "2px 2px 0 0 #000",
							borderRadius: "4px 8px 4px 8px"
						}
					}) }),
					/* @__PURE__ */ jsx(FormMessage, {})
				] })
			})
		]
	});
}
//#endregion
//#region app/feature/users/components/EnhancementsStep.tsx
function EnhancementsStep({ user, role, basicInfo, onComplete, initialData, formRef }) {
	const [formData, setFormData] = useState({
		occupation: initialData?.occupation || user.occupation || "",
		bio: initialData?.bio || user.bio || "",
		photo: initialData?.photo || null
	});
	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value
		}));
	};
	const handlePhotoChange = (e) => {
		const file = e.target.files?.[0];
		if (file) setFormData((prev) => ({
			...prev,
			photo: file
		}));
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		onComplete(formData);
	};
	const getPhotoDisplay = () => {
		if (formData.photo) return URL.createObjectURL(formData.photo);
		return null;
	};
	return /* @__PURE__ */ jsxs("form", {
		ref: formRef,
		onSubmit: handleSubmit,
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ jsxs("h2", {
					className: "text-xl font-semibold text-gray-900 flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Camera, { className: "h-5 w-5" }), "Profile Photo"]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-6",
					children: [/* @__PURE__ */ jsx(Avatar, {
						className: "h-20 w-20 border-4 border-gray-900",
						children: getPhotoDisplay() ? /* @__PURE__ */ jsx(AvatarImage, {
							src: getPhotoDisplay(),
							alt: "Profile"
						}) : /* @__PURE__ */ jsx(AvatarFallback, {
							className: "text-2xl font-bold bg-gray-100",
							children: basicInfo.name?.charAt(0).toUpperCase() || "U"
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("input", {
									type: "file",
									id: "photo",
									accept: "image/*",
									onChange: handlePhotoChange,
									className: "hidden"
								}),
								/* @__PURE__ */ jsxs(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									className: "gap-2 border-2 border-gray-900",
									onClick: () => document.getElementById("photo")?.click(),
									children: [/* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }), formData.photo ? "Change Photo" : "Upload Photo"]
								}),
								formData.photo && /* @__PURE__ */ jsx(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									onClick: () => setFormData((prev) => ({
										...prev,
										photo: null
									})),
									children: "Remove"
								})
							]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-gray-600 mt-1",
							children: "Upload a profile photo (optional)"
						})]
					})]
				})]
			}),
			role === "lawyer" && /* @__PURE__ */ jsx(ProfessionalSection, {
				formData: { occupation: formData.occupation },
				onInputChange: handleInputChange
			}),
			/* @__PURE__ */ jsx(BioSection, {
				formData: { bio: formData.bio },
				onInputChange: handleInputChange
			})
		]
	});
}
//#endregion
//#region app/feature/users/components/ProgressIndicator.tsx
function ProgressIndicator({ currentStep, selectedRole }) {
	const totalSteps = selectedRole === "legal_professional" ? 4 : 3;
	const currentStepNumber = currentStep === "role" ? 1 : currentStep === "basic" ? 2 : currentStep === "professional" ? 3 : 4;
	return /* @__PURE__ */ jsx("div", {
		className: "flex items-center justify-center gap-2 mb-8",
		children: Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => /* @__PURE__ */ jsx("div", { className: `h-2 rounded-full transition-all ${stepNum === currentStepNumber ? "w-8 bg-yellow-400" : "w-2 bg-gray-300"}` }, stepNum))
	});
}
//#endregion
//#region app/feature/users/components/StepHeader.tsx
function StepHeader({ title, description, icon }) {
	return /* @__PURE__ */ jsx("div", {
		className: "text-left mb-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-start gap-4",
			children: [icon && /* @__PURE__ */ jsx("div", {
				className: "flex-shrink-0",
				children: /* @__PURE__ */ jsx(IconContainer, {
					icon,
					size: "lg",
					color: "handdrawn"
				})
			}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
				className: "text-xl font-black text-gray-900 mb-2 font-serif",
				children: title
			}), /* @__PURE__ */ jsx("p", {
				className: "text-gray-600 text-lg",
				children: description
			})] })]
		})
	});
}
//#endregion
//#region app/feature/users/components/OnboardingNavigation.tsx
function OnboardingNavigation({ currentStep, selectedRole, onBack, onNext, onComplete, nextDisabled = false, nextText = "Continue" }) {
	const showBackButton = currentStep !== "role";
	const isLastStep = currentStep === "enhancements";
	return /* @__PURE__ */ jsx("div", {
		className: "w-full p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-2xl mx-auto w-full flex justify-between gap-4",
			children: [showBackButton && /* @__PURE__ */ jsx(Button, {
				onClick: onBack,
				variant: "outline",
				className: "px-6 py-2 border-2 border-gray-900 text-gray-700 hover:bg-gray-50",
				children: "← Back"
			}), currentStep !== "role" && (onNext || onComplete) && /* @__PURE__ */ jsxs(Button, {
				onClick: () => {
					console.log("Next button clicked, isLastStep:", isLastStep);
					if (isLastStep && onComplete) {
						console.log("Calling onComplete");
						onComplete();
					} else if (onNext) {
						console.log("Calling onNext");
						onNext();
					}
				},
				disabled: nextDisabled,
				className: "px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all duration-200 flex items-center gap-2",
				children: [isLastStep ? "Complete Profile" : nextText, /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
			})]
		})
	});
}
//#endregion
//#region app/feature/users/screens/OnboardingScreen.tsx
var OnboardingScreen = ({ user, token, updateMutation }) => {
	const [selectedRole, setSelectedRole] = useState(null);
	const [step, setStep] = useState("role");
	const [basicInfo, setBasicInfo] = useState(null);
	const [locationInfo, setLocationInfo] = useState(null);
	const [lawyerInfo, setLawyerInfo] = useState(null);
	const [enhancementsData, setEnhancementsData] = useState(null);
	const basicFormRef = useRef(null);
	const professionalFormRef = useRef(null);
	const enhancementsFormRef = useRef(null);
	const handleRoleSelect = (role) => {
		setSelectedRole(role);
		setStep("basic");
	};
	const handleBasicInfoNext = (data) => {
		console.log("handleBasicInfoNext called with:", data);
		setBasicInfo({
			name: data.name,
			age: data.age,
			gender: data.gender
		});
		setLocationInfo({
			country: data.country || "",
			city: data.city || ""
		});
		if (selectedRole === "lawyer") {
			console.log("Moving to professional step");
			setStep("professional");
		} else {
			console.log("Moving to enhancements step");
			setStep("enhancements");
		}
	};
	const handleLawyerProfessionalNext = (data) => {
		setLawyerInfo(data);
		setStep("enhancements");
	};
	const handleEnhancementsComplete = (data) => {
		setEnhancementsData(data);
		const updateData = {
			...basicInfo,
			...locationInfo,
			...data,
			role: selectedRole,
			age: basicInfo?.age ? parseInt(basicInfo.age, 10) : null,
			gender: basicInfo?.gender,
			country: locationInfo?.country?.trim() || null,
			city: locationInfo?.city?.trim() || null,
			occupation: data.occupation.trim() || null,
			bio: data.bio.trim() || null,
			isOnboarded: true,
			...selectedRole === "lawyer" && lawyerInfo ? {
				specialization: lawyerInfo.specialization,
				experienceYears: parseInt(lawyerInfo.experienceYears, 10),
				rating: lawyerInfo.rating,
				casesHandled: parseInt(lawyerInfo.casesHandled, 10),
				location: lawyerInfo.location,
				languages: lawyerInfo.languages.split(",").map((lang) => lang.trim()).filter((lang) => lang)
			} : {}
		};
		updateMutation.mutate({
			userId: user.id,
			data: updateData
		});
	};
	const handleGoBack = () => {
		if (step === "basic") setStep("role");
		else if (step === "professional") setStep("basic");
		else if (step === "enhancements") {
			if (selectedRole === "lawyer") setStep("professional");
			else setStep("basic");
		}
	};
	const handleNextStep = () => {
		console.log("handleNextStep called for step:", step);
		if (step === "basic" && basicFormRef.current) {
			console.log("Triggering basic form submission");
			basicFormRef.current.requestSubmit();
		} else if (step === "professional" && professionalFormRef.current) {
			console.log("Triggering professional form submission");
			professionalFormRef.current.requestSubmit();
		} else console.log("No form found for current step");
	};
	const handleComplete = () => {
		console.log("handleComplete called");
		if (enhancementsFormRef.current) {
			console.log("Triggering enhancements form submission");
			enhancementsFormRef.current.requestSubmit();
		} else console.log("No enhancements form found");
	};
	return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-2xl space-y-4",
		children: [
			/* @__PURE__ */ jsx(ProgressIndicator, {
				currentStep: step,
				selectedRole
			}),
			step === "role" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(StepHeader, {
				title: "Welcome to Mahakama",
				description: "Let's get started by selecting your role"
			}), /* @__PURE__ */ jsx(RoleSelector, { onRoleSelect: handleRoleSelect })] }),
			step === "basic" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(StepHeader, {
				title: "Basic Information",
				description: "Let's start with the essentials to get your profile set up",
				icon: User
			}), /* @__PURE__ */ jsx(CardWithLabel, {
				label: selectedRole === "lawyer" ? "lawyer-basic-info" : "user-basic-info",
				className: "rounded-xl border-2 border-gray-900 border-solid",
				children: selectedRole === "lawyer" ? /* @__PURE__ */ jsx(LawyerBasicInfoStep, {
					user,
					onNext: handleBasicInfoNext,
					formRef: basicFormRef
				}) : /* @__PURE__ */ jsx(BasicInfoStep, {
					user,
					onNext: handleBasicInfoNext,
					formRef: basicFormRef
				})
			})] }),
			step === "professional" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(StepHeader, {
				title: "Professional Information",
				description: "Let's gather your professional details to set up your legal profile",
				icon: Briefcase
			}), /* @__PURE__ */ jsx(CardWithLabel, {
				label: "lawyer-professional-info",
				className: "rounded-xl border-2 border-gray-900 border-solid",
				children: /* @__PURE__ */ jsx(LawyerProfessionalInfoStep, {
					user,
					onNext: handleLawyerProfessionalNext,
					formRef: professionalFormRef
				})
			})] }),
			step === "enhancements" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(StepHeader, {
				title: "Profile Enhancements",
				description: "Add optional details to personalize your Mahakama experience",
				icon: Sparkles
			}), /* @__PURE__ */ jsx(CardWithLabel, {
				label: "profile-enhancements",
				className: "rounded-xl border-2 border-gray-900 border-solid",
				children: /* @__PURE__ */ jsx(EnhancementsStep, {
					user,
					role: selectedRole,
					basicInfo,
					onComplete: handleEnhancementsComplete,
					formRef: enhancementsFormRef
				})
			})] })
		]
	}), /* @__PURE__ */ jsx(OnboardingNavigation, {
		currentStep: step,
		selectedRole,
		onBack: handleGoBack,
		onNext: step !== "enhancements" ? handleNextStep : void 0,
		onComplete: step === "enhancements" ? handleComplete : void 0
	})] }) });
};
//#endregion
//#region app/routes/users/onboarding.tsx
var onboarding_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	default: () => onboarding_default,
	loader: () => loader$1,
	meta: () => meta
});
function meta({}) {
	return [{ title: "Onboarding - Mahakama" }, {
		name: "description",
		content: "Onboarding page for Mahakama account to access your legal resources and history."
	}];
}
async function loader$1({ context }) {
	try {
		const user = context.get(userContext);
		const token = context.get(authContext)?.token || null;
		if (!user || !token) throw new Response("User not authenticated", { status: 401 });
		return {
			user,
			token,
			error: null
		};
	} catch (error) {
		handleRouteError(error, "Failed to load onboarding");
	}
}
var onboarding_default = UNSAFE_withComponentProps(function OnboardingPage({ loaderData }) {
	const { user, token, error } = loaderData;
	const updateMutation = useUpdateUser();
	return /* @__PURE__ */ jsx(OnboardingScreen, {
		user,
		token,
		updateMutation
	});
});
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useAppError();
	return /* @__PURE__ */ jsx(MahErrorBoundary, {
		status: error.status,
		data: error.data
	});
});
//#endregion
//#region app/routes/help.tsx
var help_exports = /* @__PURE__ */ __exportAll({ default: () => help_default });
var help_default = UNSAFE_withComponentProps(function HelpScreen() {
	return /* @__PURE__ */ jsxs("div", {
		className: "container mx-auto p-6 space-y-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-3xl uppercase",
					children: "How can we help, Emmanuel?"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-muted-foreground",
					children: "Search our resources or contact our regional support teams."
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid md:grid-cols-3 gap-6",
				children: [
					/* @__PURE__ */ jsxs(CardWithLabel, {
						label: "Knowledge",
						className: "hover:border-yellow-400 transition-colors cursor-pointer",
						children: [
							/* @__PURE__ */ jsx(BookOpen, { className: "mb-4 w-8 h-8" }),
							/* @__PURE__ */ jsx("h3", {
								className: "font-bold",
								children: "Legal Database Guide"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm",
								children: "Learn how to find and save regional laws like the Penal Code."
							})
						]
					}),
					/* @__PURE__ */ jsxs(CardWithLabel, {
						label: "Navigation",
						className: "hover:border-yellow-400 transition-colors cursor-pointer",
						children: [
							/* @__PURE__ */ jsx(Scale, { className: "mb-4 w-8 h-8" }),
							/* @__PURE__ */ jsx("h3", {
								className: "font-bold",
								children: "Justice Hub Basics"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm",
								children: "How to find Legal Aid and Ministry services in South Sudan or Kenya."
							})
						]
					}),
					/* @__PURE__ */ jsxs(CardWithLabel, {
						label: "Account",
						className: "hover:border-yellow-400 transition-colors cursor-pointer",
						children: [
							/* @__PURE__ */ jsx(ShieldQuestion, { className: "mb-4 w-8 h-8" }),
							/* @__PURE__ */ jsx("h3", {
								className: "font-bold",
								children: "Role Management"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm",
								children: "Switching between User and Lawyer profiles or updating credentials."
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid md:grid-cols-2 gap-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-xl font-bold pb-2",
						children: "For Seekers (Users)"
					}), /* @__PURE__ */ jsxs("ul", {
						className: "space-y-2 text-sm",
						children: [/* @__PURE__ */ jsx("li", {
							className: "p-3 bg-white border border-black rounded shadow-sm",
							children: "How do I verify a lawyer's experience?"
						}), /* @__PURE__ */ jsx("li", {
							className: "p-3 bg-white border border-black rounded shadow-sm",
							children: "Are the documents in the Legal Database official?"
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-xl font-bold pb-2",
						children: "For Professionals (Lawyers)"
					}), /* @__PURE__ */ jsxs("ul", {
						className: "space-y-2 text-sm",
						children: [/* @__PURE__ */ jsx("li", {
							className: "p-3 bg-white border border-black rounded shadow-sm",
							children: "How do I manage my \"My Clients\" dashboard?"
						}), /* @__PURE__ */ jsx("li", {
							className: "p-3 bg-white border border-black rounded shadow-sm",
							children: "Can I list services in multiple countries (e.g., Uganda & Rwanda)?"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ jsx(CardWithLabel, {
				label: "Contact Support",
				className: "bg-yellow-400",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col md:flex-row justify-between items-center gap-6",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "font-bold text-lg",
						children: "Still stuck?"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm",
						children: "Our team is available Monday–Friday, 8 AM – 5 PM (EAT)."
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ jsxs("button", {
							className: "flex items-center gap-2 bg-black text-white px-6 py-2 rounded font-bold hover:bg-zinc-800",
							children: [/* @__PURE__ */ jsx(MessageCircle, { size: 18 }), " Chat with us"]
						}), /* @__PURE__ */ jsx("button", {
							className: "flex items-center gap-2 border-2 border-black px-6 py-2 rounded font-bold hover:bg-white/50",
							children: "Email Support"
						})]
					})]
				})
			})
		]
	});
});
//#endregion
//#region app/routes/$.tsx
var $_exports = /* @__PURE__ */ __exportAll({
	NotFound: () => NotFound,
	default: () => $_default,
	loader: () => loader
});
function loader() {
	return data(null, { status: 404 });
}
function NotFound() {
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("div", { className: "absolute -left-4 -top-2 w-12 h-12 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" }),
		/* @__PURE__ */ jsx("div", { className: "absolute -right-4 -bottom-2 w-12 h-12 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" }),
		/* @__PURE__ */ jsx("div", {
			className: "text-center space-y-8 flex items-center justify-center min-h-[70vh]",
			children: /* @__PURE__ */ jsxs("div", {
				className: "space-y-6 w-full",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ jsxs("h1", {
								className: "text-7xl md:text-8xl font-extra bold text-gray-900 mb-3",
								children: ["404", /* @__PURE__ */ jsx("span", {
									className: "inline-block w-4 h-4 ml-3 bg-yellow-400 rounded-full animate-pulse",
									style: {
										boxShadow: "0 0 0 0 rgba(250, 204, 21, 0.4)",
										filter: "drop-shadow(-1px 1px 0px rgba(0,0,0,0.1)) drop-shadow(1px -1px 0px rgba(0,0,0,0.1))"
									}
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "w-24 h-2 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full mx-auto mb-4",
								style: {
									borderRadius: "8px 4px 4px 8px",
									boxShadow: "2px 2px 0px rgba(0,0,0,0.1)",
									transform: "skewX(-2deg)"
								}
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-2xl md:text-3xl font-bold text-gray-800",
								children: "Page Not Found"
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-gray-600 text-lg max-w-md mx-auto",
						children: "The page you're looking for doesn't exist. It might have been moved, deleted, or you may have followed an incorrect link."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white border-2 border-gray-900 p-6 md:p-8 relative inline-block w-full max-w-xl mx-auto",
						style: {
							borderRadius: "8px 16px 8px 16px",
							boxShadow: "3px 3px 0 0 #000"
						},
						children: [
							/* @__PURE__ */ jsx("span", { className: "absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900 bg-yellow-300" }),
							/* @__PURE__ */ jsx("span", { className: "absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900 bg-yellow-300" }),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-6",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ jsx("p", {
										className: "font-bold text-gray-700 text-sm uppercase tracking-wider",
										children: "Here's where you can go instead:"
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col sm:flex-row gap-3 justify-center",
										children: [/* @__PURE__ */ jsxs(Link, {
											to: "/",
											className: "inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-900 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold transition-all hover:shadow-lg hover:-translate-y-0.5",
											style: {
												boxShadow: "2px 2px 0 0 #000",
												borderRadius: "4px 8px 4px 8px"
											},
											children: [/* @__PURE__ */ jsx(Home, { className: "w-5 h-5" }), "Home"]
										}), /* @__PURE__ */ jsxs(Link, {
											to: "/lawyers",
											className: "inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-900 bg-white hover:bg-gray-50 text-gray-900 font-bold transition-all hover:shadow-lg hover:-translate-y-0.5",
											style: {
												boxShadow: "2px 2px 0 0 #000",
												borderRadius: "4px 8px 4px 8px"
											},
											children: [/* @__PURE__ */ jsx(Search, { className: "w-5 h-5" }), "Find a Lawyer"]
										})]
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "pt-4 border-t-2 border-gray-900 text-left",
									children: /* @__PURE__ */ jsx("p", {
										className: "text-xs font-mono text-gray-500 bg-gray-50 p-3 border border-gray-200",
										children: "Error Code: 404 Not Found"
									})
								})]
							})
						]
					})
				]
			})
		}),
		/* @__PURE__ */ jsx("div", {
			className: "text-center text-sm text-gray-600 mt-8",
			children: /* @__PURE__ */ jsxs("p", { children: [
				"Need help? Try",
				" ",
				/* @__PURE__ */ jsx(Link, {
					to: "/",
					className: "font-bold text-yellow-600 hover:text-yellow-700 hover:underline transition-colors",
					children: "returning to the homepage"
				}),
				"."
			] })
		})
	] });
}
var $_default = UNSAFE_withComponentProps(function CatchAll() {
	return /* @__PURE__ */ jsx(NotFound, {});
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-COoJvd10.js",
		"imports": ["/assets/jsx-runtime-CrzCyv7n.js", "/assets/react-dom-TACx81o5.js"],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/root-DXuDOBjE.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/react-dom-TACx81o5.js",
				"/assets/button-CEpXw047.js",
				"/assets/utils-DojpP95n.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/briefcase-BjAs6HAK.js",
				"/assets/chevron-up-CCUpzAUX.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/circle-check-big-DSCRoFr2.js",
				"/assets/footer-BwH9jsXW.js",
				"/assets/ellipsis-vertical-LHdxE_75.js",
				"/assets/globe-DkguBDBy.js",
				"/assets/house-DJxoAtcs.js",
				"/assets/library-DOFMTJAk.js",
				"/assets/settings-dmJX8y5x.js",
				"/assets/map-pin-BgOF30ol.js",
				"/assets/scale-1DZhCPoD.js",
				"/assets/sparkles-BE59DmK8.js",
				"/assets/users-D9vQWZ6L.js",
				"/assets/user-BbeqcBEJ.js",
				"/assets/x-CTV9865E.js",
				"/assets/input-BEibKuwn.js",
				"/assets/separator-8EFUkkRQ.js",
				"/assets/dist-BA8RRTo2.js",
				"/assets/tooltip-CEQpHFk5.js",
				"/assets/avatar-C0Aa0Lfs.js",
				"/assets/dropdown-menu-BnUgNCpr.js",
				"/assets/fetch-9IAA39TX.js",
				"/assets/query-DxHxCXde.js",
				"/assets/useMutation-Bp3Q33d7.js",
				"/assets/dist-DmrscvNf.js",
				"/assets/nav.paths-BpZBWYql.js",
				"/assets/use-auth-eBDvNFAy.js",
				"/assets/useTranslation-DHTyh3x1.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/DocumentsConfig-BbFLFH9T.js",
				"/assets/LawyersConfig-B_0fp8kI.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/mail-DR3cZgKZ.js",
				"/assets/shield-Bx0M2q8I.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/dist-CdqLPu-B.js",
				"/assets/dist-CTpw4MSk.js",
				"/assets/dist-DZAtH3Vg.js",
				"/assets/dist-CmR6r3za.js"
			],
			"css": ["/assets/root-pkiRLZNV.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/index": {
			"id": "routes/index",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/index-DHoNgtem.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/button-CEpXw047.js",
				"/assets/utils-DojpP95n.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/arrow-right-CaPdCYZu.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/HeroSection-ZQGNdUfu.js",
				"/assets/file-text-bHnisC7v.js",
				"/assets/library-DOFMTJAk.js",
				"/assets/scale-1DZhCPoD.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/users-D9vQWZ6L.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/diagnoal-separator-CRIh-bdF.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/briefcase-BjAs6HAK.js",
				"/assets/chevron-right-yfXFTHQM.js",
				"/assets/house-DJxoAtcs.js",
				"/assets/shield-Bx0M2q8I.js",
				"/assets/input-BEibKuwn.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"feature/www/layouts/website.layout": {
			"id": "feature/www/layouts/website.layout",
			"parentId": "root",
			"path": void 0,
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/website.layout-HKqxw1Bl.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/utils-DojpP95n.js",
				"/assets/chevron-up-CCUpzAUX.js",
				"/assets/footer-BwH9jsXW.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/mail-DR3cZgKZ.js",
				"/assets/scale-1DZhCPoD.js",
				"/assets/shield-Bx0M2q8I.js",
				"/assets/card-with-label-Cjr8yJLa.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/www/about": {
			"id": "routes/www/about",
			"parentId": "feature/www/layouts/website.layout",
			"path": "about",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/about-5ZiV-89V.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/utils-DojpP95n.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/arrow-right-CaPdCYZu.js",
				"/assets/book-open-C88M-s0i.js",
				"/assets/chevron-right-yfXFTHQM.js",
				"/assets/clock-Ctzx7uH1.js",
				"/assets/HeroSection-ZQGNdUfu.js",
				"/assets/file-text-bHnisC7v.js",
				"/assets/globe-DkguBDBy.js",
				"/assets/message-circle-B-74kDZ_.js",
				"/assets/scale-1DZhCPoD.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/diagnoal-separator-CRIh-bdF.js",
				"/assets/briefcase-BjAs6HAK.js",
				"/assets/house-DJxoAtcs.js",
				"/assets/shield-Bx0M2q8I.js",
				"/assets/users-D9vQWZ6L.js",
				"/assets/input-BEibKuwn.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/www/contact": {
			"id": "routes/www/contact",
			"parentId": "feature/www/layouts/website.layout",
			"path": "contact",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/contact-zq_9Misj.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/globe-DkguBDBy.js",
				"/assets/mail-DR3cZgKZ.js",
				"/assets/map-pin-BgOF30ol.js",
				"/assets/send-Bf7ed7GA.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/utils-DojpP95n.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/www/legal-hub": {
			"id": "routes/www/legal-hub",
			"parentId": "feature/www/layouts/website.layout",
			"path": "legal-hub",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/legal-hub-Dx6eIzZV.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/button-CEpXw047.js",
				"/assets/utils-DojpP95n.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/use-services-pmUuC1ye.js",
				"/assets/chevron-right-yfXFTHQM.js",
				"/assets/HeroSection-ZQGNdUfu.js",
				"/assets/LoadingState-DBQMIfS1.js",
				"/assets/list-controls-D3_Ul4Ae.js",
				"/assets/map-pin-BgOF30ol.js",
				"/assets/scale-1DZhCPoD.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/shield-Bx0M2q8I.js",
				"/assets/input-BEibKuwn.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/diagnoal-separator-CRIh-bdF.js",
				"/assets/fetch-9IAA39TX.js",
				"/assets/useQuery-f1lLFjf3.js",
				"/assets/dist-DmrscvNf.js",
				"/assets/query-DxHxCXde.js",
				"/assets/react-dom-TACx81o5.js",
				"/assets/briefcase-BjAs6HAK.js",
				"/assets/file-text-bHnisC7v.js",
				"/assets/house-DJxoAtcs.js",
				"/assets/users-D9vQWZ6L.js",
				"/assets/loader-circle-Dg3Qeqjt.js",
				"/assets/plus-DNTdtnoU.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/bookmark-jPqWQj89.js",
				"/assets/select-BHGlcTfR.js",
				"/assets/share-D8Fkx6xQ.js",
				"/assets/dist-CdqLPu-B.js",
				"/assets/dist-CTpw4MSk.js",
				"/assets/zod-BDaCBXEu.js",
				"/assets/button-group-COQWp5fA.js",
				"/assets/chevron-up-CCUpzAUX.js",
				"/assets/dist-CmR6r3za.js",
				"/assets/separator-8EFUkkRQ.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/www/legal-hub/$serviceId": {
			"id": "routes/www/legal-hub/$serviceId",
			"parentId": "feature/www/layouts/website.layout",
			"path": "legal-hub/:serviceId",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/_serviceId-C_9nIaXA.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/button-CEpXw047.js",
				"/assets/arrow-left-B96wQ2An.js",
				"/assets/use-services-pmUuC1ye.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/clock-Ctzx7uH1.js",
				"/assets/file-text-bHnisC7v.js",
				"/assets/house-DJxoAtcs.js",
				"/assets/contact-information-BMwSFYpg.js",
				"/assets/page-details-error-BDwWK7Pu.js",
				"/assets/users-D9vQWZ6L.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/page-detail-header-CE1Xum0P.js",
				"/assets/utils-DojpP95n.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/fetch-9IAA39TX.js",
				"/assets/useQuery-f1lLFjf3.js",
				"/assets/dist-DmrscvNf.js",
				"/assets/query-DxHxCXde.js",
				"/assets/react-dom-TACx81o5.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/calendar-CkpaYXrg.js",
				"/assets/globe-DkguBDBy.js",
				"/assets/mail-DR3cZgKZ.js",
				"/assets/map-pin-BgOF30ol.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/chevron-right-yfXFTHQM.js",
				"/assets/badge-DwGTqwCL.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app/index": {
			"id": "routes/app/index",
			"parentId": "root",
			"path": "app",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/index-BqgU0s4c.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/NewChatScreen-2L7FN9vH.js",
				"/assets/button-CEpXw047.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/arrow-right-CaPdCYZu.js",
				"/assets/plus-DNTdtnoU.js",
				"/assets/scale-1DZhCPoD.js",
				"/assets/separator-8EFUkkRQ.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/zod-BDaCBXEu.js",
				"/assets/use-chats-lV8xHNdG.js",
				"/assets/api.schemas-Dj6GxQ4u.js",
				"/assets/input-group-SVSIvykn.js",
				"/assets/use-documents-Xs6oWYeW.js",
				"/assets/utils-DojpP95n.js",
				"/assets/dist-CdqLPu-B.js",
				"/assets/react-dom-TACx81o5.js",
				"/assets/fetch-9IAA39TX.js",
				"/assets/useQuery-f1lLFjf3.js",
				"/assets/useMutation-Bp3Q33d7.js",
				"/assets/dist-DmrscvNf.js",
				"/assets/query-DxHxCXde.js",
				"/assets/input-BEibKuwn.js",
				"/assets/textarea-CiiEC0Da.js",
				"/assets/DocumentsConfig-BbFLFH9T.js",
				"/assets/nav.paths-BpZBWYql.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/notifications/index": {
			"id": "routes/notifications/index",
			"parentId": "root",
			"path": "notifications",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/index-CFK_nHHK.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/fetch-9IAA39TX.js",
				"/assets/useQuery-f1lLFjf3.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/button-CEpXw047.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/utils-DojpP95n.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/query-DxHxCXde.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/auth/login": {
			"id": "routes/auth/login",
			"parentId": "root",
			"path": "login",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/login-CINjELrx.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/auth-alternative-DusXmixp.js",
				"/assets/dist-DmrscvNf.js",
				"/assets/use-auth-eBDvNFAy.js",
				"/assets/useTranslation-DHTyh3x1.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/zod-BDaCBXEu.js",
				"/assets/api.schemas-Dj6GxQ4u.js",
				"/assets/button-CEpXw047.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/utils-DojpP95n.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/loader-circle-Dg3Qeqjt.js",
				"/assets/mail-DR3cZgKZ.js",
				"/assets/user-BbeqcBEJ.js",
				"/assets/input-BEibKuwn.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/label-Cw8PFFfy.js",
				"/assets/form-DUrnVSqb.js",
				"/assets/dist-CdqLPu-B.js",
				"/assets/react-dom-TACx81o5.js",
				"/assets/fetch-9IAA39TX.js",
				"/assets/useMutation-Bp3Q33d7.js",
				"/assets/nav.paths-BpZBWYql.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/auth/signup": {
			"id": "routes/auth/signup",
			"parentId": "root",
			"path": "signup",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/signup-BarlQ5qk.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/auth-alternative-DusXmixp.js",
				"/assets/dist-DmrscvNf.js",
				"/assets/use-auth-eBDvNFAy.js",
				"/assets/useTranslation-DHTyh3x1.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/zod-BDaCBXEu.js",
				"/assets/api.schemas-Dj6GxQ4u.js",
				"/assets/button-CEpXw047.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/utils-DojpP95n.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/loader-circle-Dg3Qeqjt.js",
				"/assets/mail-DR3cZgKZ.js",
				"/assets/user-BbeqcBEJ.js",
				"/assets/input-BEibKuwn.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/label-Cw8PFFfy.js",
				"/assets/form-DUrnVSqb.js",
				"/assets/dist-CdqLPu-B.js",
				"/assets/react-dom-TACx81o5.js",
				"/assets/fetch-9IAA39TX.js",
				"/assets/useMutation-Bp3Q33d7.js",
				"/assets/nav.paths-BpZBWYql.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/auth/forgot-password": {
			"id": "routes/auth/forgot-password",
			"parentId": "root",
			"path": "forgot-password",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/forgot-password-BczOgLBv.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/arrow-left-B96wQ2An.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/mail-DR3cZgKZ.js",
				"/assets/useTranslation-DHTyh3x1.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/button-CEpXw047.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/utils-DojpP95n.js",
				"/assets/icon-container-Bh5pRVZ-.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/chats/chats.new": {
			"id": "routes/chats/chats.new",
			"parentId": "root",
			"path": "chats/new",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/chats.new-BF7Leb6f.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/NewChatScreen-2L7FN9vH.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/button-CEpXw047.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/arrow-right-CaPdCYZu.js",
				"/assets/plus-DNTdtnoU.js",
				"/assets/scale-1DZhCPoD.js",
				"/assets/separator-8EFUkkRQ.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/zod-BDaCBXEu.js",
				"/assets/use-chats-lV8xHNdG.js",
				"/assets/api.schemas-Dj6GxQ4u.js",
				"/assets/input-group-SVSIvykn.js",
				"/assets/use-documents-Xs6oWYeW.js",
				"/assets/utils-DojpP95n.js",
				"/assets/dist-CdqLPu-B.js",
				"/assets/react-dom-TACx81o5.js",
				"/assets/fetch-9IAA39TX.js",
				"/assets/useQuery-f1lLFjf3.js",
				"/assets/useMutation-Bp3Q33d7.js",
				"/assets/dist-DmrscvNf.js",
				"/assets/query-DxHxCXde.js",
				"/assets/input-BEibKuwn.js",
				"/assets/textarea-CiiEC0Da.js",
				"/assets/DocumentsConfig-BbFLFH9T.js",
				"/assets/nav.paths-BpZBWYql.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/search-Cy2_up7Y.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/chats/chats.recents": {
			"id": "routes/chats/chats.recents",
			"parentId": "root",
			"path": "chats/recents",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/chats.recents-Bi6ZBBt-.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/LoadingState-DBQMIfS1.js",
				"/assets/ChatHeader-DORvUda7.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/use-chats-lV8xHNdG.js",
				"/assets/ChatItem-BdB5Zf0q.js",
				"/assets/button-CEpXw047.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/utils-DojpP95n.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/house-DJxoAtcs.js",
				"/assets/loader-circle-Dg3Qeqjt.js",
				"/assets/plus-DNTdtnoU.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/ellipsis-vertical-LHdxE_75.js",
				"/assets/share-2-C3SxCzvd.js",
				"/assets/trash-2-C_EmvVQj.js",
				"/assets/dropdown-menu-BnUgNCpr.js",
				"/assets/alert-dialog-BNqO1Wzt.js",
				"/assets/dist-BA8RRTo2.js",
				"/assets/dist-CdqLPu-B.js",
				"/assets/dist-CTpw4MSk.js",
				"/assets/dist-DZAtH3Vg.js",
				"/assets/react-dom-TACx81o5.js",
				"/assets/fetch-9IAA39TX.js",
				"/assets/useQuery-f1lLFjf3.js",
				"/assets/useMutation-Bp3Q33d7.js",
				"/assets/dist-DmrscvNf.js",
				"/assets/query-DxHxCXde.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/chats/$chatId": {
			"id": "routes/chats/$chatId",
			"parentId": "root",
			"path": "chats/:chatId",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/_chatId-D7OCRlAi.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/button-CEpXw047.js",
				"/assets/utils-DojpP95n.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/file-text-bHnisC7v.js",
				"/assets/message-circle-B-74kDZ_.js",
				"/assets/plus-DNTdtnoU.js",
				"/assets/send-Bf7ed7GA.js",
				"/assets/ChatHeader-DORvUda7.js",
				"/assets/page-details-error-BDwWK7Pu.js",
				"/assets/tooltip-CEQpHFk5.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/zod-BDaCBXEu.js",
				"/assets/button-group-COQWp5fA.js",
				"/assets/use-chats-lV8xHNdG.js",
				"/assets/input-group-SVSIvykn.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/ellipsis-vertical-LHdxE_75.js",
				"/assets/share-2-C3SxCzvd.js",
				"/assets/trash-2-C_EmvVQj.js",
				"/assets/dropdown-menu-BnUgNCpr.js",
				"/assets/alert-dialog-BNqO1Wzt.js",
				"/assets/dist-BA8RRTo2.js",
				"/assets/dist-CdqLPu-B.js",
				"/assets/dist-CTpw4MSk.js",
				"/assets/dist-DZAtH3Vg.js",
				"/assets/react-dom-TACx81o5.js",
				"/assets/dist-CmR6r3za.js",
				"/assets/separator-8EFUkkRQ.js",
				"/assets/fetch-9IAA39TX.js",
				"/assets/useQuery-f1lLFjf3.js",
				"/assets/useMutation-Bp3Q33d7.js",
				"/assets/dist-DmrscvNf.js",
				"/assets/query-DxHxCXde.js",
				"/assets/input-BEibKuwn.js",
				"/assets/textarea-CiiEC0Da.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/documents/index": {
			"id": "routes/documents/index",
			"parentId": "root",
			"path": "documents",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/index-BHmlyGci.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/HeroSection-ZQGNdUfu.js",
				"/assets/download-DzYwFNYJ.js",
				"/assets/LoadingState-DBQMIfS1.js",
				"/assets/file-text-bHnisC7v.js",
				"/assets/list-controls-D3_Ul4Ae.js",
				"/assets/library-DOFMTJAk.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/diagnoal-separator-CRIh-bdF.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/use-documents-Xs6oWYeW.js",
				"/assets/page-loading-BU0QOeGL.js",
				"/assets/button-CEpXw047.js",
				"/assets/utils-DojpP95n.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/briefcase-BjAs6HAK.js",
				"/assets/chevron-right-yfXFTHQM.js",
				"/assets/house-DJxoAtcs.js",
				"/assets/scale-1DZhCPoD.js",
				"/assets/shield-Bx0M2q8I.js",
				"/assets/users-D9vQWZ6L.js",
				"/assets/input-BEibKuwn.js",
				"/assets/loader-circle-Dg3Qeqjt.js",
				"/assets/plus-DNTdtnoU.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/bookmark-jPqWQj89.js",
				"/assets/select-BHGlcTfR.js",
				"/assets/share-D8Fkx6xQ.js",
				"/assets/dist-CdqLPu-B.js",
				"/assets/dist-CTpw4MSk.js",
				"/assets/zod-BDaCBXEu.js",
				"/assets/button-group-COQWp5fA.js",
				"/assets/react-dom-TACx81o5.js",
				"/assets/chevron-up-CCUpzAUX.js",
				"/assets/dist-CmR6r3za.js",
				"/assets/separator-8EFUkkRQ.js",
				"/assets/fetch-9IAA39TX.js",
				"/assets/useQuery-f1lLFjf3.js",
				"/assets/DocumentsConfig-BbFLFH9T.js",
				"/assets/query-DxHxCXde.js",
				"/assets/nav.paths-BpZBWYql.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/documents/$documentId": {
			"id": "routes/documents/$documentId",
			"parentId": "root",
			"path": "documents/:documentId",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/_documentId-ZF4IbzP_.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/bookmark-jPqWQj89.js",
				"/assets/calendar-CkpaYXrg.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/circle-check-big-DSCRoFr2.js",
				"/assets/download-DzYwFNYJ.js",
				"/assets/file-text-bHnisC7v.js",
				"/assets/share-2-C3SxCzvd.js",
				"/assets/page-details-error-BDwWK7Pu.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/page-detail-header-CE1Xum0P.js",
				"/assets/use-documents-Xs6oWYeW.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/button-CEpXw047.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/utils-DojpP95n.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/arrow-left-B96wQ2An.js",
				"/assets/chevron-right-yfXFTHQM.js",
				"/assets/house-DJxoAtcs.js",
				"/assets/badge-DwGTqwCL.js",
				"/assets/fetch-9IAA39TX.js",
				"/assets/useQuery-f1lLFjf3.js",
				"/assets/DocumentsConfig-BbFLFH9T.js",
				"/assets/query-DxHxCXde.js",
				"/assets/nav.paths-BpZBWYql.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/lawyers/index": {
			"id": "routes/lawyers/index",
			"parentId": "root",
			"path": "lawyers",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/index-BL0OhQ2t.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/button-CEpXw047.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/briefcase-BjAs6HAK.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/select-BHGlcTfR.js",
				"/assets/chevron-right-yfXFTHQM.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/circle-check-big-DSCRoFr2.js",
				"/assets/HeroSection-ZQGNdUfu.js",
				"/assets/LoadingState-DBQMIfS1.js",
				"/assets/list-controls-D3_Ul4Ae.js",
				"/assets/map-pin-BgOF30ol.js",
				"/assets/users-D9vQWZ6L.js",
				"/assets/x-CTV9865E.js",
				"/assets/input-BEibKuwn.js",
				"/assets/avatar-C0Aa0Lfs.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/diagnoal-separator-CRIh-bdF.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/badge-DwGTqwCL.js",
				"/assets/page-loading-BU0QOeGL.js",
				"/assets/use-lawyers-DIPZWL3M.js",
				"/assets/utils-DojpP95n.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/react-dom-TACx81o5.js",
				"/assets/chevron-up-CCUpzAUX.js",
				"/assets/dist-CdqLPu-B.js",
				"/assets/dist-CTpw4MSk.js",
				"/assets/dist-CmR6r3za.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/file-text-bHnisC7v.js",
				"/assets/house-DJxoAtcs.js",
				"/assets/scale-1DZhCPoD.js",
				"/assets/shield-Bx0M2q8I.js",
				"/assets/loader-circle-Dg3Qeqjt.js",
				"/assets/plus-DNTdtnoU.js",
				"/assets/bookmark-jPqWQj89.js",
				"/assets/share-D8Fkx6xQ.js",
				"/assets/zod-BDaCBXEu.js",
				"/assets/button-group-COQWp5fA.js",
				"/assets/separator-8EFUkkRQ.js",
				"/assets/fetch-9IAA39TX.js",
				"/assets/useQuery-f1lLFjf3.js",
				"/assets/dist-DmrscvNf.js",
				"/assets/LawyersConfig-B_0fp8kI.js",
				"/assets/query-DxHxCXde.js",
				"/assets/nav.paths-BpZBWYql.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/lawyers/$lawyerId": {
			"id": "routes/lawyers/$lawyerId",
			"parentId": "root",
			"path": "lawyers/:lawyerId",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/_lawyerId-DiUM0C3f.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/utils-DojpP95n.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/briefcase-BjAs6HAK.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/LoadingState-DBQMIfS1.js",
				"/assets/house-DJxoAtcs.js",
				"/assets/map-pin-BgOF30ol.js",
				"/assets/contact-information-BMwSFYpg.js",
				"/assets/scale-1DZhCPoD.js",
				"/assets/page-details-error-BDwWK7Pu.js",
				"/assets/users-D9vQWZ6L.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/diagnoal-separator-CRIh-bdF.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/page-detail-header-CE1Xum0P.js",
				"/assets/use-lawyers-DIPZWL3M.js",
				"/assets/bordered-box-DaV8PSyD.js",
				"/assets/button-CEpXw047.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/loader-circle-Dg3Qeqjt.js",
				"/assets/plus-DNTdtnoU.js",
				"/assets/calendar-CkpaYXrg.js",
				"/assets/globe-DkguBDBy.js",
				"/assets/mail-DR3cZgKZ.js",
				"/assets/arrow-left-B96wQ2An.js",
				"/assets/chevron-right-yfXFTHQM.js",
				"/assets/badge-DwGTqwCL.js",
				"/assets/fetch-9IAA39TX.js",
				"/assets/useQuery-f1lLFjf3.js",
				"/assets/dist-DmrscvNf.js",
				"/assets/LawyersConfig-B_0fp8kI.js",
				"/assets/query-DxHxCXde.js",
				"/assets/react-dom-TACx81o5.js",
				"/assets/nav.paths-BpZBWYql.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/users/$profile": {
			"id": "routes/users/$profile",
			"parentId": "root",
			"path": "users/:profile",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/_profile-DeyueKBb.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/button-CEpXw047.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/RoleSelector-CRJ8gPSn.js",
				"/assets/ellipsis-vertical-LHdxE_75.js",
				"/assets/file-text-bHnisC7v.js",
				"/assets/ProfileTabs-B1TrPojB.js",
				"/assets/share-D8Fkx6xQ.js",
				"/assets/trash-2-C_EmvVQj.js",
				"/assets/user-BbeqcBEJ.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/bordered-box-DaV8PSyD.js",
				"/assets/utils-DojpP95n.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/briefcase-BjAs6HAK.js",
				"/assets/select-BHGlcTfR.js",
				"/assets/input-BEibKuwn.js",
				"/assets/fetch-9IAA39TX.js",
				"/assets/useQuery-f1lLFjf3.js",
				"/assets/useMutation-Bp3Q33d7.js",
				"/assets/dist-DmrscvNf.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/textarea-CiiEC0Da.js",
				"/assets/label-Cw8PFFfy.js",
				"/assets/react-dom-TACx81o5.js",
				"/assets/chevron-up-CCUpzAUX.js",
				"/assets/dist-CdqLPu-B.js",
				"/assets/dist-CTpw4MSk.js",
				"/assets/dist-CmR6r3za.js",
				"/assets/query-DxHxCXde.js",
				"/assets/bookmark-jPqWQj89.js",
				"/assets/map-pin-BgOF30ol.js",
				"/assets/contact-information-BMwSFYpg.js",
				"/assets/avatar-C0Aa0Lfs.js",
				"/assets/dist-DZAtH3Vg.js",
				"/assets/calendar-CkpaYXrg.js",
				"/assets/globe-DkguBDBy.js",
				"/assets/mail-DR3cZgKZ.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/users/settings": {
			"id": "routes/users/settings",
			"parentId": "root",
			"path": "users/settings",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/settings-rd1VufH8.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/button-CEpXw047.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/RoleSelector-CRJ8gPSn.js",
				"/assets/settings-dmJX8y5x.js",
				"/assets/ProfileTabs-B1TrPojB.js",
				"/assets/shield-Bx0M2q8I.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/utils-DojpP95n.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/briefcase-BjAs6HAK.js",
				"/assets/select-BHGlcTfR.js",
				"/assets/file-text-bHnisC7v.js",
				"/assets/input-BEibKuwn.js",
				"/assets/fetch-9IAA39TX.js",
				"/assets/useQuery-f1lLFjf3.js",
				"/assets/useMutation-Bp3Q33d7.js",
				"/assets/dist-DmrscvNf.js",
				"/assets/textarea-CiiEC0Da.js",
				"/assets/label-Cw8PFFfy.js",
				"/assets/react-dom-TACx81o5.js",
				"/assets/chevron-up-CCUpzAUX.js",
				"/assets/dist-CdqLPu-B.js",
				"/assets/dist-CTpw4MSk.js",
				"/assets/dist-CmR6r3za.js",
				"/assets/query-DxHxCXde.js",
				"/assets/bookmark-jPqWQj89.js",
				"/assets/map-pin-BgOF30ol.js",
				"/assets/contact-information-BMwSFYpg.js",
				"/assets/user-BbeqcBEJ.js",
				"/assets/avatar-C0Aa0Lfs.js",
				"/assets/dist-DZAtH3Vg.js",
				"/assets/calendar-CkpaYXrg.js",
				"/assets/globe-DkguBDBy.js",
				"/assets/mail-DR3cZgKZ.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/messages/index": {
			"id": "routes/messages/index",
			"parentId": "root",
			"path": "messages",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/index-C5u1cpBC.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/ChatItem-BdB5Zf0q.js",
				"/assets/button-CEpXw047.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/utils-DojpP95n.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/ellipsis-vertical-LHdxE_75.js",
				"/assets/dist-BA8RRTo2.js",
				"/assets/alert-dialog-BNqO1Wzt.js",
				"/assets/dist-CdqLPu-B.js",
				"/assets/dist-CTpw4MSk.js",
				"/assets/dist-DZAtH3Vg.js",
				"/assets/react-dom-TACx81o5.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/messages/conversationId": {
			"id": "routes/messages/conversationId",
			"parentId": "root",
			"path": "messages/:conversationId",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/conversationId-WQs6YfrD.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/button-CEpXw047.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/utils-DojpP95n.js",
				"/assets/icon-container-Bh5pRVZ-.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/users/onboarding": {
			"id": "routes/users/onboarding",
			"parentId": "root",
			"path": "onboarding",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/onboarding-CV0brRWV.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/button-CEpXw047.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/arrow-right-CaPdCYZu.js",
				"/assets/briefcase-BjAs6HAK.js",
				"/assets/select-BHGlcTfR.js",
				"/assets/ErrorBoundary-HI-ib_Ow.js",
				"/assets/RoleSelector-CRJ8gPSn.js",
				"/assets/sparkles-BE59DmK8.js",
				"/assets/user-BbeqcBEJ.js",
				"/assets/input-BEibKuwn.js",
				"/assets/avatar-C0Aa0Lfs.js",
				"/assets/icon-container-Bh5pRVZ-.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/useAppError-x4BQ_pAo.js",
				"/assets/zod-BDaCBXEu.js",
				"/assets/textarea-CiiEC0Da.js",
				"/assets/label-Cw8PFFfy.js",
				"/assets/form-DUrnVSqb.js",
				"/assets/utils-DojpP95n.js",
				"/assets/react-dom-TACx81o5.js",
				"/assets/chevron-up-CCUpzAUX.js",
				"/assets/dist-CdqLPu-B.js",
				"/assets/dist-CTpw4MSk.js",
				"/assets/dist-CmR6r3za.js",
				"/assets/ErrorState-BwQvO_bY.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/file-text-bHnisC7v.js",
				"/assets/fetch-9IAA39TX.js",
				"/assets/useQuery-f1lLFjf3.js",
				"/assets/useMutation-Bp3Q33d7.js",
				"/assets/dist-DmrscvNf.js",
				"/assets/query-DxHxCXde.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/help": {
			"id": "routes/help",
			"parentId": "root",
			"path": "help",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/help-jVqfg9ia.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/createLucideIcon-RMBo0s_c.js",
				"/assets/book-open-C88M-s0i.js",
				"/assets/message-circle-B-74kDZ_.js",
				"/assets/scale-1DZhCPoD.js",
				"/assets/card-with-label-Cjr8yJLa.js",
				"/assets/utils-DojpP95n.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/$": {
			"id": "routes/$",
			"parentId": "root",
			"path": "*",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/_-DGObgLMY.js",
			"imports": [
				"/assets/jsx-runtime-CrzCyv7n.js",
				"/assets/house-DJxoAtcs.js",
				"/assets/search-Cy2_up7Y.js",
				"/assets/createLucideIcon-RMBo0s_c.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-c42bd63a.js",
	"version": "c42bd63a",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build/client";
var basename = "/";
var future = {
	"unstable_optimizeDeps": false,
	"v8_passThroughRequests": false,
	"v8_trailingSlashAwareDataRequests": false,
	"unstable_previewServerPrerendering": false,
	"v8_middleware": true,
	"v8_splitRouteModules": false,
	"v8_viteEnvironmentApi": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/index": {
		id: "routes/index",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: routes_exports
	},
	"feature/www/layouts/website.layout": {
		id: "feature/www/layouts/website.layout",
		parentId: "root",
		path: void 0,
		index: void 0,
		caseSensitive: void 0,
		module: website_layout_exports
	},
	"routes/www/about": {
		id: "routes/www/about",
		parentId: "feature/www/layouts/website.layout",
		path: "about",
		index: void 0,
		caseSensitive: void 0,
		module: about_exports
	},
	"routes/www/contact": {
		id: "routes/www/contact",
		parentId: "feature/www/layouts/website.layout",
		path: "contact",
		index: void 0,
		caseSensitive: void 0,
		module: contact_exports
	},
	"routes/www/legal-hub": {
		id: "routes/www/legal-hub",
		parentId: "feature/www/layouts/website.layout",
		path: "legal-hub",
		index: void 0,
		caseSensitive: void 0,
		module: legal_hub_exports
	},
	"routes/www/legal-hub/$serviceId": {
		id: "routes/www/legal-hub/$serviceId",
		parentId: "feature/www/layouts/website.layout",
		path: "legal-hub/:serviceId",
		index: void 0,
		caseSensitive: void 0,
		module: $serviceId_exports
	},
	"routes/app/index": {
		id: "routes/app/index",
		parentId: "root",
		path: "app",
		index: void 0,
		caseSensitive: void 0,
		module: app_exports
	},
	"routes/notifications/index": {
		id: "routes/notifications/index",
		parentId: "root",
		path: "notifications",
		index: void 0,
		caseSensitive: void 0,
		module: notifications_exports
	},
	"routes/auth/login": {
		id: "routes/auth/login",
		parentId: "root",
		path: "login",
		index: void 0,
		caseSensitive: void 0,
		module: login_exports
	},
	"routes/auth/signup": {
		id: "routes/auth/signup",
		parentId: "root",
		path: "signup",
		index: void 0,
		caseSensitive: void 0,
		module: signup_exports
	},
	"routes/auth/forgot-password": {
		id: "routes/auth/forgot-password",
		parentId: "root",
		path: "forgot-password",
		index: void 0,
		caseSensitive: void 0,
		module: forgot_password_exports
	},
	"routes/chats/chats.new": {
		id: "routes/chats/chats.new",
		parentId: "root",
		path: "chats/new",
		index: void 0,
		caseSensitive: void 0,
		module: chats_new_exports
	},
	"routes/chats/chats.recents": {
		id: "routes/chats/chats.recents",
		parentId: "root",
		path: "chats/recents",
		index: void 0,
		caseSensitive: void 0,
		module: chats_recents_exports
	},
	"routes/chats/$chatId": {
		id: "routes/chats/$chatId",
		parentId: "root",
		path: "chats/:chatId",
		index: void 0,
		caseSensitive: void 0,
		module: $chatId_exports
	},
	"routes/documents/index": {
		id: "routes/documents/index",
		parentId: "root",
		path: "documents",
		index: void 0,
		caseSensitive: void 0,
		module: documents_exports
	},
	"routes/documents/$documentId": {
		id: "routes/documents/$documentId",
		parentId: "root",
		path: "documents/:documentId",
		index: void 0,
		caseSensitive: void 0,
		module: $documentId_exports
	},
	"routes/lawyers/index": {
		id: "routes/lawyers/index",
		parentId: "root",
		path: "lawyers",
		index: void 0,
		caseSensitive: void 0,
		module: lawyers_exports
	},
	"routes/lawyers/$lawyerId": {
		id: "routes/lawyers/$lawyerId",
		parentId: "root",
		path: "lawyers/:lawyerId",
		index: void 0,
		caseSensitive: void 0,
		module: $lawyerId_exports
	},
	"routes/users/$profile": {
		id: "routes/users/$profile",
		parentId: "root",
		path: "users/:profile",
		index: void 0,
		caseSensitive: void 0,
		module: $profile_exports
	},
	"routes/users/settings": {
		id: "routes/users/settings",
		parentId: "root",
		path: "users/settings",
		index: void 0,
		caseSensitive: void 0,
		module: settings_exports
	},
	"routes/messages/index": {
		id: "routes/messages/index",
		parentId: "root",
		path: "messages",
		index: void 0,
		caseSensitive: void 0,
		module: messages_exports
	},
	"routes/messages/conversationId": {
		id: "routes/messages/conversationId",
		parentId: "root",
		path: "messages/:conversationId",
		index: void 0,
		caseSensitive: void 0,
		module: conversationId_exports
	},
	"routes/users/onboarding": {
		id: "routes/users/onboarding",
		parentId: "root",
		path: "onboarding",
		index: void 0,
		caseSensitive: void 0,
		module: onboarding_exports
	},
	"routes/help": {
		id: "routes/help",
		parentId: "root",
		path: "help",
		index: void 0,
		caseSensitive: void 0,
		module: help_exports
	},
	"routes/$": {
		id: "routes/$",
		parentId: "root",
		path: "*",
		index: void 0,
		caseSensitive: void 0,
		module: $_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
