---
title: Greet a visitor
theme: Greeting
---

## Who
Anyone who opens the app.

## Why
Every visitor is welcomed by name. Repeat visits are counted.

## Business rules
- An empty name is greeted as "stranger".

## What can go wrong
- Nothing: greeting never fails.

## Entry points
- Library: {{greet}}

## Steps
1. [Visitor → Greeter] Gives a name — {{greet}}
2. [Greeter → GreetingLog] Counts the visit — {{GreetingLog}}

## Errors
- None.
