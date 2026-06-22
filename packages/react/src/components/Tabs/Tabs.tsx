/**
 * Tabs Component
 * Simple tabs for content organization
 */

import React, { useState } from 'react'
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl'
import './Tabs.css'

export interface Tab {
  id: string
  label: string
  /** Короткая подпись для segmented control на узком экране */
  compactLabel?: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultActiveTab?: string
  activeTab?: string
  onTabChange?: (tabId: string) => void
  className?: string
  /** On mobile agreement-style segmented control instead of underline tabs */
  variant?: 'default' | 'segmented'
}

export const Tabs: React.FC<TabsProps> = ({ 
  tabs, 
  defaultActiveTab, 
  activeTab: controlledActiveTab,
  onTabChange,
  className = '',
  variant = 'default',
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultActiveTab || tabs[0]?.id)

  // Используем controlled или uncontrolled режим
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab

  const handleTabClick = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId)
    }
    onTabChange?.(tabId)
  }

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  const tabsClassName = [
    'tabs',
    variant === 'segmented' ? 'tabs--segmented' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={tabsClassName}>
      {variant === 'segmented' ? (
        <div className="tabs-header tabs-header--segmented">
          <SegmentedControl
            options={tabs.map((tab) => ({
              id: tab.id,
              label: tab.compactLabel ?? tab.label,
              ariaLabel: tab.compactLabel ? tab.label : undefined,
            }))}
            value={activeTab}
            onChange={handleTabClick}
            ariaLabel="Разделы договора"
          />
        </div>
      ) : (
        <div className="tabs-header">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tabs-tab ${activeTab === tab.id ? 'tabs-tab-active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      <div className="tabs-content">
        {activeTabContent}
      </div>
    </div>
  )
}

