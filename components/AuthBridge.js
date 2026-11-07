"use client";

// Loading this module installs the auth interceptors (see lib/client/authClient.js)
// as soon as the client bundle runs, before any page effect makes an API call.
import "@/lib/client/authClient";

export default function AuthBridge() {
  return null;
}
