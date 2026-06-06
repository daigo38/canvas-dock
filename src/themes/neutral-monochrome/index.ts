import type { ThemeSet } from "@/renderer/shared/themed";
import * as button from "./components/ui/button";
import * as card from "./components/ui/card";
import * as badge from "./components/ui/badge";
import * as alert from "./components/ui/alert";
import * as separator from "./components/ui/separator";
import * as statCard from "./components/ui/stat-card";
import * as dataTable from "./components/ui/data-table";
import * as progress from "./components/ui/progress";
import * as empty from "./components/ui/empty";
import * as sectionHeader from "./components/ui/section-header";
import * as codeBlock from "./components/ui/code-block";
import * as avatar from "./components/ui/avatar";
import * as kbd from "./components/ui/kbd";
import * as typography from "./components/ui/typography";
import * as tabs from "./components/ui/tabs";
import * as accordion from "./components/ui/accordion";
import * as breadcrumb from "./components/ui/breadcrumb";
import * as tooltip from "./components/ui/tooltip";
import * as pagination from "./components/ui/pagination";
import * as skeleton from "./components/ui/skeleton";
import * as chart from "./components/ui/chart";
import * as input from "./components/ui/input";
import * as textarea from "./components/ui/textarea";
import * as field from "./components/ui/field";
import * as table from "./components/ui/table";
import * as scrollArea from "./components/ui/scroll-area";
import * as statusIndicator from "./components/ui/status-indicator";
import * as spinner from "./components/ui/spinner";
import * as timeline from "./components/ui/timeline";
import * as steps from "./components/ui/steps";
import * as rating from "./components/ui/rating";
import * as notification from "./components/ui/notification";

const buttonSet = button as Partial<ThemeSet>;
const cardSet = card as Partial<ThemeSet>;
const badgeSet = badge as Partial<ThemeSet>;
const alertSet = alert as Partial<ThemeSet>;
const separatorSet = separator as Partial<ThemeSet>;
const statCardSet = statCard as Partial<ThemeSet>;
const dataTableSet = dataTable as Partial<ThemeSet>;
const progressSet = progress as Partial<ThemeSet>;
const emptySet = empty as Partial<ThemeSet>;
const sectionHeaderSet = sectionHeader as Partial<ThemeSet>;
const codeBlockSet = codeBlock as Partial<ThemeSet>;
const avatarSet = avatar as Partial<ThemeSet>;
const kbdSet = kbd as Partial<ThemeSet>;
const typographySet = typography as Partial<ThemeSet>;
const tabsSet = tabs as Partial<ThemeSet>;
const accordionSet = accordion as Partial<ThemeSet>;
const breadcrumbSet = breadcrumb as Partial<ThemeSet>;
const tooltipSet = tooltip as Partial<ThemeSet>;
const paginationSet = pagination as Partial<ThemeSet>;
const skeletonSet = skeleton as Partial<ThemeSet>;
const chartSet = chart as Partial<ThemeSet>;
const inputSet = input as Partial<ThemeSet>;
const textareaSet = textarea as Partial<ThemeSet>;
const fieldSet = field as Partial<ThemeSet>;
const tableSet = table as Partial<ThemeSet>;
const scrollAreaSet = scrollArea as Partial<ThemeSet>;
const statusIndicatorSet = statusIndicator as Partial<ThemeSet>;
const spinnerSet = spinner as Partial<ThemeSet>;
const timelineSet = timeline as Partial<ThemeSet>;
const stepsSet = steps as Partial<ThemeSet>;
const ratingSet = rating as Partial<ThemeSet>;
const notificationSet = notification as Partial<ThemeSet>;

export const set: ThemeSet = {
  Button: buttonSet.Button,
  Card: cardSet.Card,
  CardHeader: cardSet.CardHeader,
  CardTitle: cardSet.CardTitle,
  CardDescription: cardSet.CardDescription,
  CardContent: cardSet.CardContent,
  Badge: badgeSet.Badge,
  Alert: alertSet.Alert,
  AlertTitle: alertSet.AlertTitle,
  AlertDescription: alertSet.AlertDescription,
  Separator: separatorSet.Separator,
  StatCard: statCardSet.StatCard,
  DataTable: dataTableSet.DataTable,
  Progress: progressSet.Progress,
  Empty: emptySet.Empty,
  SectionHeader: sectionHeaderSet.SectionHeader,
  CodeBlock: codeBlockSet.CodeBlock,
  Avatar: avatarSet.Avatar,
  AvatarImage: avatarSet.AvatarImage,
  AvatarFallback: avatarSet.AvatarFallback,
  Kbd: kbdSet.Kbd,
  H1: typographySet.H1,
  H2: typographySet.H2,
  H3: typographySet.H3,
  H4: typographySet.H4,
  P: typographySet.P,
  Lead: typographySet.Lead,
  Large: typographySet.Large,
  Small: typographySet.Small,
  Muted: typographySet.Muted,
  Blockquote: typographySet.Blockquote,
  Code: typographySet.Code,
  InlineCode: typographySet.InlineCode,
  Tabs: tabsSet.Tabs,
  TabsList: tabsSet.TabsList,
  TabsTrigger: tabsSet.TabsTrigger,
  TabsContent: tabsSet.TabsContent,
  Accordion: accordionSet.Accordion,
  AccordionItem: accordionSet.AccordionItem,
  AccordionTrigger: accordionSet.AccordionTrigger,
  AccordionContent: accordionSet.AccordionContent,
  Breadcrumb: breadcrumbSet.Breadcrumb,
  BreadcrumbList: breadcrumbSet.BreadcrumbList,
  BreadcrumbItem: breadcrumbSet.BreadcrumbItem,
  BreadcrumbLink: breadcrumbSet.BreadcrumbLink,
  BreadcrumbPage: breadcrumbSet.BreadcrumbPage,
  BreadcrumbSeparator: breadcrumbSet.BreadcrumbSeparator,
  Tooltip: tooltipSet.Tooltip,
  TooltipTrigger: tooltipSet.TooltipTrigger,
  TooltipContent: tooltipSet.TooltipContent,
  TooltipProvider: tooltipSet.TooltipProvider,
  Pagination: paginationSet.Pagination,
  PaginationContent: paginationSet.PaginationContent,
  PaginationItem: paginationSet.PaginationItem,
  PaginationLink: paginationSet.PaginationLink,
  PaginationNext: paginationSet.PaginationNext,
  PaginationPrevious: paginationSet.PaginationPrevious,
  PaginationEllipsis: paginationSet.PaginationEllipsis,
  Skeleton: skeletonSet.Skeleton,
  ChartContainer: chartSet.ChartContainer,
  ChartTooltip: chartSet.ChartTooltip,
  ChartTooltipContent: chartSet.ChartTooltipContent,
  ChartLegend: chartSet.ChartLegend,
  ChartLegendContent: chartSet.ChartLegendContent,
  Input: inputSet.Input,
  Textarea: textareaSet.Textarea,
  Field: fieldSet.Field,
  Table: tableSet.Table,
  TableHeader: tableSet.TableHeader,
  TableBody: tableSet.TableBody,
  TableHead: tableSet.TableHead,
  TableRow: tableSet.TableRow,
  TableCell: tableSet.TableCell,
  TableCaption: tableSet.TableCaption,
  ScrollArea: scrollAreaSet.ScrollArea,
  StatusIndicator: statusIndicatorSet.StatusIndicator,
  Spinner: spinnerSet.Spinner,
  Timeline: timelineSet.Timeline,
  Steps: stepsSet.Steps,
  Rating: ratingSet.Rating,
  Notification: notificationSet.Notification,
};
