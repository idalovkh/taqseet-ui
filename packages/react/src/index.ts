// Providers & theme
export {
  ThemeProvider,
  useTheme,
  type ThemeMode,
  type ResolvedTheme,
} from './providers/ThemeProvider'

// Contexts
export { FullscreenOverlayProvider, useFullscreenOverlay } from './contexts/FullscreenOverlayContext'
export {
  ScrollRestorationProvider,
  ScrollRestorationContext,
  useRestoreScrollWhenReady,
} from './contexts/ScrollRestorationContext'

// Hooks
export { useBreakpoint } from './hooks/useBreakpoint'
export { useDebounce } from './hooks/useDebounce'
export { useLocalStorage } from './hooks/useLocalStorage'
export { useListPageCompactLayout } from './hooks/useListPageCompactLayout'
export { useMenuBackLink } from './hooks/useMenuBackLink'
export { useInfiniteListPage } from './hooks/useInfiniteListPage'
export { useInfiniteScrollTrigger } from './hooks/useInfiniteScrollTrigger'
export { usePaginationState } from './hooks/usePaginationState'
export { useSearchInUrl } from './hooks/useSearchInUrl'
export { useHorizontalSnapCarousel } from './hooks/useHorizontalSnapCarousel'
export { useListKpiLabels } from './hooks/useListKpiLabels'
export { useMaxWidth } from './hooks/useMaxWidth'
export { useAppShellSidebar, type UseAppShellSidebarOptions, type UseAppShellSidebarResult } from './hooks/useAppShellSidebar'
export { configureMenuBackNavigation, type MenuBackNavigationConfig } from './config/menuBackNavigation'
export { SUPPORT_CONFIG } from './config/support.config'

// UI primitives
export { Button } from './components/Button'
export { Input } from './components/Input'
export { Textarea } from './components/Textarea'
export { Select } from './components/Select'
export type { SelectOption } from './components/Select'
export { Modal, ModalPortalProvider } from './components/Modal'
export { FullscreenModalHeader, useModalPortalContainer } from './components/Modal'
export type { FullscreenModalHeaderProps } from './components/Modal'
export { BottomSheet } from './components/BottomSheet'
export { Alert } from './components/Alert'
export type { AlertVariant } from './components/Alert'
export { Badge } from './components/Badge'
export type { BadgeShape, BadgeVariant } from './components/Badge'
export { StatusBadge } from './components/StatusBadge'
export { getStatusDisplay, getStatusLabel } from './components/StatusBadge'
export type { StatusDisplay } from './components/StatusBadge'
export { LoadingSpinner } from './components/LoadingSpinner'
export { Tooltip } from './components/Tooltip'
export { ThemeToggle } from './components/ThemeToggle'
export { Tabs } from './components/Tabs'
export type { Tab } from './components/Tabs'
export { Table, type TableColumn } from './components/Table'
export { KpiSummary } from './components/KpiSummary'
export type { KpiItem, KpiSummaryLayout, KpiSummaryProps } from './components/KpiSummary'
export { ListKpiSummary } from './components/ListKpiSummary'
export { DatePicker } from './components/DatePicker'
export type { DatePickerProps } from './components/DatePicker'
export { HelpMenu } from './components/HelpMenu'
export { PasswordInput } from './components/PasswordInput'
export { GenderSelect, type GenderSelectProps, type GenderValue } from './components/GenderSelect'
export { ErrorMessage } from './components/ErrorMessage'
export { ErrorBanner } from './components/ErrorBanner'
export { ConfirmDialog } from './components/ConfirmDialog'
export { ActionsMenuTrigger } from './components/ActionsMenuTrigger'
export { SearchInput, type SearchInputProps } from './components/SearchInput'
export { SearchableSelect, type SearchableSelectProps } from './components/SearchableSelect'
export { DropdownMenu, type DropdownMenuItem } from './components/DropdownMenu'
export { Pagination } from './components/Pagination'
export { Avatar } from './components/Avatar'
export { BlobPreviewModal, type BlobPreviewModalProps } from './components/BlobPreviewModal'
export { CarouselPageDots } from './components/CarouselPageDots'
export {
  CircleIconButton,
  DismissButton,
  type CircleIconButtonSize,
  type CircleIconButtonVariant,
} from './components/CircleIconButton'
export { DatePeriodFilter } from './components/DatePeriodFilter'
export { InfiniteScrollFooter } from './components/InfiniteScrollFooter'
export { ListScrollFooter } from './components/ListScrollFooter'
export {
  IosListCard,
  IosListCardList,
  IosListCardEmpty,
  IosListCardSkeleton,
  toneFromRowClassName,
  buildIosListCardProps,
} from './components/IosListCard'
export type { IosListCardProps, IosListCardRowData, IosListCardTone, MobileCardRole } from './components/IosListCard'
export { ListIosCardsLayout, type ListIosCardsLayoutVariant } from './components/ListIosCardsLayout'
export { ListFilterDropdown, ListFiltersCombined } from './components/ListFilter'
export type { ListFilterDropdownProps, ListFilterOption, FilterOption, FilterGroupConfig } from './components/ListFilter'
export { MobileNavRow, MobileNavGroup, type MobileNavRowProps } from './components/MobileNavRow'
export { MobileStaticRow, MobileGroupDivider, type MobileStaticRowProps } from './components/MobileStaticRow'
export { MonthlyBarChart, type BarConfig } from './components/MonthlyBarChart'
export { NotificationBell } from './components/NotificationBell'
export { SegmentedControl, type SegmentedControlOption } from './components/SegmentedControl'
export { Stepper } from './components/Stepper'
export { EmptyState, type EmptyStateProps } from './components/EmptyState'

// Layout
export { PageContent, type PageContentVariant } from './components/layout/PageContent'
export { PageTitleRow } from './components/layout/PageTitleRow'
export { FlowPage } from './components/layout/FlowPage/FlowPage'
export { ListPageLayout, type ListPageBackLink } from './components/layout/ListPageLayout'
export { ListPageDesktopToolbar } from './components/layout/ListPageDesktopToolbar'
export { ListPageToolbarSearchRow } from './components/layout/ListPageToolbarSearchRow'
export { ListPageCreateButton } from './components/layout/ListPageCreateButton'
export { ListPageToolbarBelowSummary } from './components/layout/ListPageToolbarBelowSummary/ListPageToolbarBelowSummary'
export { MenuBackLink } from './components/layout/MenuBackLink'
export { ProfileIdentityCard } from './components/layout/ProfileIdentityCard'
export { ErrorBoundary } from './components/layout/ErrorBoundary'
export { RouterErrorBoundary } from './components/layout/RouterErrorBoundary'
export { SectionHubGrid, type SectionHubGridProps, type SectionHubItem } from './components/layout/SectionHubGrid'
export { ListRouteFallback, type ListRouteFallbackProps } from './components/layout/ListRouteFallback'
export { AuthPageLayout, type AuthPageLayoutProps } from './components/layout/AuthPageLayout'
export { AppShellFrame, type AppShellFrameProps } from './components/layout/AppShellFrame'

export {
  AccountMenu,
  AccountMenuTrigger,
  AccountMenuPanel,
  AccountMenuSection,
  AccountMenuDivider,
  type AccountMenuProps,
  type AccountMenuTriggerProps,
  type AccountMenuPanelProps,
  type AccountMenuSectionProps,
  useAccountMenu,
} from './components/AccountMenu'

// Settings layout kit
export {
  SettingsSection,
  type SettingsSectionProps,
  SettingsGroup,
  type SettingsGroupProps,
  SettingsNotice,
  type SettingsNoticeProps,
  type SettingsNoticeVariant,
  SettingsNavItem,
  type SettingsNavItemProps,
  SettingsPageFrame,
  type SettingsPageFrameProps,
  type SettingsBackLink,
} from './components/settings'

// Utils
export { showToast, toast } from './utils/toast'
export {
  formatMoney,
  formatCurrency,
  formatMoneyCompact,
  parseMoney,
  formatDate,
  formatDateTime,
  formatDateShort,
  formatDateLong,
  formatDateTimeShort,
  formatDateTimeLong,
  formatSurnameAndInitials,
} from './utils/formatters'
export {
  rublesToKopecks,
  ensureInteger,
  kopecksToRubles,
  formatKopecksAsCurrency,
  formatMoneyRUB,
  pluralizePayments,
  formatMoneyInput,
  parseMoneyInput,
  formatMoney as formatMoneyWholeRubles,
} from './utils/money'
export {
  type DatePeriod,
  type DatePeriodPreset,
  type DatePeriodDirection,
  resolveDatePeriod,
  getDefaultDatePeriod,
  buildDateRangeQuery,
  isDatePeriodActive,
  DATE_PERIOD_PRESET_LABELS,
  formatDatePeriodLabel,
} from './utils/datePeriod'
export {
  shouldUseInAppBlobPreview,
  downloadBlob,
  openBlobInNewTab,
  printHtmlDocument,
} from './utils/blobFile'
export {
  isChunkLoadError,
  clearAppCaches,
  recoverFromChunkLoadError,
  resetChunkRecoveryGuard,
  initChunkLoadRecovery,
} from './utils/chunkLoadRecovery'
