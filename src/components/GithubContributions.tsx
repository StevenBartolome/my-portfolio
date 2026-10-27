import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import fallbackData from '../data/githubFallback.json';

interface DayContribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionsPayload {
  total: {
    lastYear: number;
  };
  contributions: DayContribution[];
}

const GITHUB_USERNAME = 'StevenBartolome';
const CACHE_KEY = 'steven_github_contributions_v3';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache

export const GithubContributions: React.FC = () => {
  const [data, setData] = useState<{ total: number; contributions: DayContribution[] }>(() => {
    // 1. Try reading fresh cached data from localStorage if it has full contribution count
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (
          parsed.timestamp &&
          Date.now() - parsed.timestamp < CACHE_TTL_MS &&
          parsed.total >= fallbackData.total
        ) {
          return { total: parsed.total, contributions: parsed.contributions };
        }
      }
    } catch {
      // Ignore storage error
    }
    // 2. Default to the complete 654 contributions dataset matching your GitHub
    return {
      total: fallbackData.total,
      contributions: fallbackData.contributions as DayContribution[],
    };
  });

  const [hoveredDay, setHoveredDay] = useState<{
    day: DayContribution;
    x: number;
    y: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync with live GitHub API (only updates if GitHub public API includes private contributions >= 654)
  useEffect(() => {
    let isMounted = true;

    const fetchLiveContributions = async () => {
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`);
        if (!res.ok) return;
        const json: ContributionsPayload = await res.json();

        // If the public API returns total >= 654 (e.g. when private contributions are made public), update
        if (isMounted && json.total && Array.isArray(json.contributions) && json.total.lastYear >= fallbackData.total) {
          const freshData = {
            total: json.total.lastYear,
            contributions: json.contributions,
          };
          setData(freshData);

          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({
                ...freshData,
                timestamp: Date.now(),
              })
            );
          } catch {
            // Ignore storage quota
          }
        }
      } catch {
        // Retain verified 654 contributions
      }
    };

    fetchLiveContributions();
    return () => {
      isMounted = false;
    };
  }, []);

  // Dismiss tooltip when tapping outside on mobile devices
  useEffect(() => {
    const handleTouchOutside = (e: TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setHoveredDay(null);
      }
    };
    window.addEventListener('touchstart', handleTouchOutside);
    return () => window.removeEventListener('touchstart', handleTouchOutside);
  }, []);

  // Organize days into 53 columns (weeks of the year) with 7 days each
  const weeks = useMemo(() => {
    const list = data.contributions;
    if (!list || list.length === 0) return [];

    const result: (DayContribution | null)[][] = [];
    let currentWeek: (DayContribution | null)[] = [];

    // Find the starting weekday of the first contribution (0 = Sunday)
    const firstDate = new Date(list[0].date + 'T00:00:00');
    const startDay = firstDate.getDay();

    // Pad first week with nulls for alignment
    for (let i = 0; i < startDay; i++) {
      currentWeek.push(null);
    }

    list.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      result.push(currentWeek);
    }

    return result;
  }, [data.contributions]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleMouseEnter = (day: DayContribution, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredDay({
      day,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleTouchStart = (day: DayContribution, e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredDay({
      day,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  return (
    <section className="github-section" id="github">
      <div className="container">
        <div className="github-panel-container" ref={containerRef}>
          
          {/* Header Row: 04 — github and @HANDLE ↗ */}
          <div className="github-header-row reveal-text">
            <div className="deck-header-left">
              <span className="deck-header-num">04 — github</span>
            </div>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="github-handle-link"
              title="View Steven's GitHub profile"
            >
              <span>@{GITHUB_USERNAME.toUpperCase()}</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Dot Matrix Contribution Grid (Fully visible, non-scrollable across all screens) */}
          <div className="github-grid-wrapper reveal-fade reveal-delay-1">
            <div className="github-grid">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="github-week-col">
                  {week.map((day, dIdx) => {
                    if (!day) {
                      return <div key={`empty-${dIdx}`} className="github-dot-cell empty" />;
                    }

                    return (
                      <div
                        key={day.date}
                        className={`github-dot-cell level-${day.level}`}
                        onMouseEnter={(e) => handleMouseEnter(day, e)}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={(e) => handleTouchStart(day, e)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${day.count} contributions on ${day.date}`}
                      >
                        <span className={`github-dot level-${day.level}`} />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Floating Tooltip */}
          {hoveredDay && (
            <div
              className="github-tooltip"
              style={{
                left: `${hoveredDay.x}px`,
                top: `${hoveredDay.y}px`,
              }}
            >
              <span className="tooltip-count">
                {hoveredDay.day.count === 0
                  ? 'No contributions'
                  : `${hoveredDay.day.count} contribution${hoveredDay.day.count === 1 ? '' : 's'}`}
              </span>
              <span className="tooltip-date">on {formatDate(hoveredDay.day.date)}</span>
            </div>
          )}

          {/* Bottom Info Row: 654 Contributions in the last year */}
          <div className="github-footer-row">
            <div className="github-total-text">
              {data.total.toLocaleString()} CONTRIBUTIONS IN THE LAST YEAR
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
