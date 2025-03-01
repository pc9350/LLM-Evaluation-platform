"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Github, Trophy } from "lucide-react";
import { useExperimentStore } from "@/store/experimentStore";
import { Progress } from "@/components/ui/progress";

export function Navbar() {
  const pathname = usePathname();
  const { userXp, userLevel } = useExperimentStore();

  const navItems = [
    { name: "Experiments", path: "/new-experiment" },
    { name: "Saved", path: "/saved-experiments" },
    { name: "Dashboard", path: "/Dashboard" },
    { name: "Models", path: "/models" },
    { name: "Docs", path: "/docs" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LLM Evaluator
              </span>
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.path
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium ml-1">Level {userLevel}</span>
              <div className="w-24 ml-2">
                <Progress 
                  value={(userXp % 100)} 
                  max={100} 
                  className="h-2 bg-gray-200 dark:bg-gray-700" 
                />
              </div>
            </div>
            <Link href="https://github.com/pc9350/LLM-Evaluation-platform" target="_blank">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 