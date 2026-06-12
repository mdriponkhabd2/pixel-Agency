import React, { useState, useEffect } from "react";
import { 
  TrendingUp, Users, ShoppingBag, FolderHeart, HelpCircle, 
  Settings, Sparkles, Plus, Edit2, Trash2, Check, X, FileText, 
  MessageSquare, LayoutDashboard, Database, ToggleLeft, ToggleRight, ShieldAlert 
} from "lucide-react";
import { Service, ServicePackage, PortfolioItem, Testimonial, FAQ, Order, User, WebsiteSettings, ContactMessage } from "../types";

interface AdminPanelProps {
  services: Service[];
  packages: ServicePackage[];
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  orders: Order[];
  contacts: ContactMessage[];
  users: User[];
  settings: WebsiteSettings;
  onRefreshData: () => void;
  onNavigate: (route: string) => void;
}

export default function AdminPanel({
  services,
  packages,
  portfolio,
  testimonials,
  faqs,
  orders,
  contacts,
  users,
  settings,
  onRefreshData,
  onNavigate
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'packages' | 'portfolio' | 'testimonials' | 'faqs' | 'orders' | 'contacts' | 'users' | 'settings'>('overview');

  // Common UI State Modals
  const [loading, setLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState("");
  const [actionError, setActionError] = useState("");

  // SQL integration states
  const [sqlTesting, setSqlTesting] = useState(false);
  const [sqlMessage, setSqlMessage] = useState("");
  const [sqlError, setSqlError] = useState("");
  
  // Custom Edit Targets
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  // New Creation States
  const [newSvcName, setNewSvcName] = useState("");
  const [newSvcShortDesc, setNewSvcShortDesc] = useState("");
  const [newSvcDesc, setNewSvcDesc] = useState("");
  const [newSvcBanner, setNewSvcBanner] = useState("");
  const [newSvcIcon, setNewSvcIcon] = useState("");

  const [newPkgSvcId, setNewPkgSvcId] = useState("");
  const [newPkgName, setNewPkgName] = useState("");
  const [newPkgPrice, setNewPkgPrice] = useState(199);
  const [newPkgDesc, setNewPkgDesc] = useState("");
  const [newPkgFeatures, setNewPkgFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [newPkgCustomOrderUrl, setNewPkgCustomOrderUrl] = useState("");

  const [newPortTitle, setNewPortTitle] = useState("");
  const [newPortSvcId, setNewPortSvcId] = useState("");
  const [newPortImage, setNewPortImage] = useState("");
  const [newPortDesc, setNewPortDesc] = useState("");

  const [newTestName, setNewTestName] = useState("");
  const [newTestRole, setNewTestRole] = useState("");
  const [newTestCompany, setNewTestCompany] = useState("");
  const [newTestComment, setNewTestComment] = useState("");
  const [newTestRating, setNewTestRating] = useState(5);

  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");
  const [newFaqSvc, setNewFaqSvc] = useState("");

  const [newMenuLabel, setNewMenuLabel] = useState("");
  const [newMenuUrl, setNewMenuUrl] = useState("");
  const [newMenuIsExternal, setNewMenuIsExternal] = useState(true);

  const [currentSettings, setCurrentSettings] = useState<WebsiteSettings>(settings);

  // Gemini optimization assistant panel
  const [assistantLoading, setAssistantLoading] = useState(false);

  useEffect(() => {
    setCurrentSettings(settings);
    // Auto-select first service initially for package forms etc.
    if (services.length > 0) {
      setNewPkgSvcId(services[0].id);
      setNewPortSvcId(services[0].id);
    }
  }, [settings, services]);

  const showSuccessMessage = (msg: string) => {
    setActionStatus(msg);
    setTimeout(() => setActionStatus(""), 4000);
  };

  const showErrorMessage = (msg: string) => {
    setActionError(msg);
    setTimeout(() => setActionError(""), 4000);
  };

  // ------------------------------------
  // SETTINGS MANAGEMENT
  // ------------------------------------
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setActionError("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentSettings)
      });
      if (!response.ok) throw new Error("Failed to update general settings.");
      showSuccessMessage("Website configurations updated dynamically!");
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // SQL actions
  const handleTestSqlConnection = async () => {
    if (!currentSettings.sqlConnectionUri) {
      setSqlError("You must first provide a non-empty SQL Connection URI link.");
      return;
    }
    setSqlTesting(true);
    setSqlMessage("");
    setSqlError("");
    try {
      const resp = await fetch("/api/admin/sql/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dialect: currentSettings.sqlDialect || "postgres",
          connectionUri: currentSettings.sqlConnectionUri
        })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Connection test returned failure.");
      setSqlMessage("✓ Excellent! Connection test succeeded! Your database is fully accessible.");
    } catch (err: any) {
      setSqlError(err.message || "Unable to reach database server.");
    } finally {
      setSqlTesting(false);
    }
  };

  const handleSyncToSql = async () => {
    if (!currentSettings.sqlConnectionUri) {
      setSqlError("Provide a SQL Connection URI string first.");
      return;
    }
    if (!confirm("Are you sure? This will recreate the tables on your SQL database and overwrite all of its active services/testimonials/settings rows with current local data. Continue?")) return;
    
    setSqlTesting(true);
    setSqlMessage("");
    setSqlError("");
    try {
      const resp = await fetch("/api/admin/sql/sync-to", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dialect: currentSettings.sqlDialect || "postgres",
          connectionUri: currentSettings.sqlConnectionUri
        })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Migration sync failed.");
      setSqlMessage("✓ Migration Complete! All settings, services, packages, reviews, faqs, users, and orders are successfully pushed to SQL!");
    } catch (err: any) {
      setSqlError(err.message || "Failed migrating records to SQL.");
    } finally {
      setSqlTesting(false);
    }
  };

  const handleSyncFromSql = async () => {
    if (!currentSettings.sqlConnectionUri) {
      setSqlError("Provide a SQL Connection URI link first.");
      return;
    }
    if (!confirm("Caution: This will import all data from your SQL tables, completely overwriting the current files on this web container & Firestore! Continue?")) return;

    setSqlTesting(true);
    setSqlMessage("");
    setSqlError("");
    try {
      const resp = await fetch("/api/admin/sql/sync-from", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dialect: currentSettings.sqlDialect || "postgres",
          connectionUri: currentSettings.sqlConnectionUri
        })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Import sync failed.");
      setSqlMessage("✓ Success! Full database states have been pulled and rewritten from SQL tables!");
      onRefreshData();
    } catch (err: any) {
      setSqlError(err.message || "Import failed. Verify database has been seeded using 'SYNC DATA TO SQL' beforehand.");
    } finally {
      setSqlTesting(false);
    }
  };

  // ------------------------------------
  // SERVICES CRUD
  // ------------------------------------
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSvcName || !newSvcShortDesc) return;
    setLoading(true);

    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSvcName,
          shortDescription: newSvcShortDesc,
          description: newSvcDesc,
          bannerUrl: newSvcBanner,
          icon: newSvcIcon
        })
      });
      if (!response.ok) throw new Error("Unable to create service.");
      showSuccessMessage("Custom Service registered and seeded!");
      setNewSvcName("");
      setNewSvcShortDesc("");
      setNewSvcDesc("");
      setNewSvcBanner("");
      setNewSvcIcon("");
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/services/${editingService.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService)
      });
      if (!response.ok) throw new Error("Unable to update service.");
      showSuccessMessage("Service parameters modified successfully!");
      setEditingService(null);
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure? Deleting a service will clean all its packages in the database too!")) return;
    try {
      const resp = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error("Deletion failed.");
      showSuccessMessage("Service and underlying package nodes liquidated.");
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    }
  };

  // ------------------------------------
  // PACKAGES CRUD
  // ------------------------------------
  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setNewPkgFeatures([...newPkgFeatures, featureInput.trim()]);
    setFeatureInput("");
  };

  const handleRemoveFeature = (idx: number) => {
    setNewPkgFeatures(newPkgFeatures.filter((_, i) => i !== idx));
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgName || !newPkgSvcId) return;
    setLoading(true);

    try {
      const response = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: newPkgSvcId,
          name: newPkgName,
          price: newPkgPrice,
          description: newPkgDesc,
          features: newPkgFeatures,
          enabled: true,
          customOrderUrl: newPkgCustomOrderUrl
        })
      });
      if (!response.ok) throw new Error("Could not register package.");
      showSuccessMessage("Service package option established!");
      setNewPkgName("");
      setNewPkgDesc("");
      setNewPkgPrice(199);
      setNewPkgFeatures([]);
      setNewPkgCustomOrderUrl("");
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/packages/${editingPackage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPackage)
      });
      if (!response.ok) throw new Error("Update failed.");
      showSuccessMessage("Dynamic Pricing details successfully overwritten!");
      setEditingPackage(null);
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePackage = async (pkg: ServicePackage) => {
    try {
      const response = await fetch(`/api/admin/packages/${pkg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !pkg.enabled })
      });
      if (!response.ok) throw new Error("Toggle status update failed.");
      showSuccessMessage(`Package ${!pkg.enabled ? "Enabled" : "Disabled"} successfully!`);
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package? This removes it permanently.")) return;
    try {
      const resp = await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error("Could not delete package.");
      showSuccessMessage("Package liquidated from agency options.");
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    }
  };

  // ------------------------------------
  // GEMINI POWERED ASSISTANT OPTIMIZER (EXTRA PREMIUM FEATURE)
  // ------------------------------------
  const handleAIOptimize = async (pkg: ServicePackage) => {
    setAssistantLoading(true);
    setActionError("");

    try {
      const svcName = services.find(s => s.id === pkg.serviceId)?.name || "Digital Service";
      const response = await fetch("/api/admin/ai-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceName: svcName,
          packageName: pkg.name,
          currentDescription: pkg.description,
          currentFeatures: pkg.features
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Optimizations temporarily unavailable.");

      // Open package editing modal immediately and pre-fill optimized copies
      setEditingPackage({
        ...pkg,
        description: data.optimizedDescription,
        features: data.optimizedFeatures
      });

      showSuccessMessage("AI Suggestion dispatched! Check the editing panel to save optimized fields.");
    } catch (err: any) {
      showErrorMessage(err.message || "API keys or AI engine temporarily inactive.");
    } finally {
      setAssistantLoading(false);
    }
  };

  // ------------------------------------
  // PORTFOLIO CRUD
  // ------------------------------------
  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortTitle || !newPortImage) return;
    setLoading(true);

    try {
      const response = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newPortTitle,
          serviceId: newPortSvcId,
          imageUrl: newPortImage,
          description: newPortDesc
        })
      });
      if (!response.ok) throw new Error("Portfolio ingestion failed.");
      showSuccessMessage("Creative visual case study added!");
      setNewPortTitle("");
      setNewPortImage("");
      setNewPortDesc("");
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPortfolio) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/portfolio/${editingPortfolio.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPortfolio)
      });
      if (!response.ok) throw new Error("Unable to update.");
      showSuccessMessage("Portfolio updated successfully!");
      setEditingPortfolio(null);
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm("Remove this case study?")) return;
    try {
      const resp = await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error("Delete failed.");
      showSuccessMessage("Portfolio item scrubbed.");
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    }
  };

  // ------------------------------------
  // TESTIMONIALS CRUD
  // ------------------------------------
  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName || !newTestComment) return;
    setLoading(true);

    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: newTestName,
          clientRole: newTestRole,
          company: newTestCompany,
          comment: newTestComment,
          rating: newTestRating
        })
      });
      if (!response.ok) throw new Error("Ingestion error.");
      showSuccessMessage("Client endorsement reviews secured!");
      setNewTestName("");
      setNewTestRole("");
      setNewTestCompany("");
      setNewTestComment("");
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/testimonials/${editingTestimonial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTestimonial)
      });
      if (!response.ok) throw new Error("Modification error.");
      showSuccessMessage("Endorsement parameters updated!");
      setEditingTestimonial(null);
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Delete this review endorsement?")) return;
    try {
      const resp = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error("Delete failed.");
      showSuccessMessage("Client review deleted.");
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    }
  };

  // ------------------------------------
  // FAQS CRUD
  // ------------------------------------
  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ || !newFaqA) return;
    setLoading(true);

    try {
      const response = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: newFaqQ,
          answer: newFaqA,
          serviceId: newFaqSvc || "general"
        })
      });
      if (!response.ok) throw new Error("FAQ addition failed.");
      showSuccessMessage("Creative FAQ added to dynamic database!");
      setNewFaqQ("");
      setNewFaqA("");
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/faqs/${editingFaq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingFaq)
      });
      if (!response.ok) throw new Error("FAO Modification failed.");
      showSuccessMessage("FAQ details modified!");
      setEditingFaq(null);
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Are you sure? permanently scrubs this FAQ row.")) return;
    try {
      const resp = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error("Delete execution failed.");
      showSuccessMessage("FAQ row liquidated.");
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    }
  };

  // ------------------------------------
  // ORDERS DISPATCH & STATS
  // ------------------------------------
  const handleUpdateOrderStatus = async (id: string, nextStatus: 'active' | 'completed' | 'cancelled') => {
    try {
      const resp = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      if (!resp.ok) throw new Error("Workflow change failed.");
      showSuccessMessage(`Project status moved to '${nextStatus}' successfully!`);
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Permanently delete this order record?")) return;
    try {
      const resp = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error("Deletion failed.");
      showSuccessMessage("Order row deleted.");
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    }
  };

  // ------------------------------------
  // CONTACT SUBMISSIONS
  // ------------------------------------
  const handleMarkContactRead = async (id: string) => {
    try {
      const resp = await fetch(`/api/admin/contacts/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" })
      });
      if (!resp.ok) throw new Error("Update failed.");
      showSuccessMessage("Contact query marked as reviewed.");
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Are you sure? SCRUBS this contact inquiry permanently.")) return;
    try {
      const resp = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error("Failed to delete.");
      showSuccessMessage("Contact inquiry row scrubbed.");
      onRefreshData();
    } catch (err: any) {
      showErrorMessage(err.message);
    }
  };

  // Financial Revenue aggregator helper
  const totalCompletedRevenue = orders
    .filter(o => o.status === "completed" || o.status === "active")
    .reduce((curr, o) => curr + (o.price || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 font-sans" id="admin-panel-viewport-core">
      
      {/* 1. Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-dark-border gap-4 animate-fade-in">
        <div>
          <div className="flex items-center space-x-2 text-brand text-xs font-mono tracking-widest uppercase">
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span>VIP AGENCY SYSTEM ACCESS</span>
          </div>
          
          <h2 className="text-4xl font-extrabold font-display tracking-tight text-white uppercase mt-1">
            Manager <span className="text-brand">Dashboard</span>
          </h2>
        </div>

        <button
          onClick={() => onNavigate("home")}
          className="py-2.5 px-5 rounded-lg border border-brand/30 text-xs font-semibold uppercase hover:bg-brand/10 text-brand transition-colors text-center w-full md:w-auto focus:outline-none"
        >
          View Live Site Feed
        </button>
      </div>

      {/* Global Notifications inside Panel */}
      {actionStatus && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          ✓ Success: {actionStatus}
        </div>
      )}
      {actionError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono">
          ⚠ Exception: {actionError}
        </div>
      )}

      {assistantLoading && (
        <div className="mb-6 p-4 rounded-xl bg-brand/10 border border-brand/30 text-brand text-xs font-mono flex items-center space-x-2 animate-pulse">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>Gemini-2.5-flash optimizing package parameters... Drafting professional copies.</span>
        </div>
      )}

      {/* 2. Main Admin Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar Drawer */}
        <div className="lg:col-span-3 bg-dark-card border border-dark-border rounded-2xl p-4 space-y-1.5 shadow-xl">
          <h3 className="text-[10px] font-mono tracking-widest uppercase text-gray-500 mb-4 px-3">
            Navigation Rails
          </h3>

          {[
            { id: "overview", icon: LayoutDashboard, label: "Overview Metrics" },
            { id: "services", icon: Database, label: "Manage Services" },
            { id: "packages", icon: FileText, label: "Manage Packages" },
            { id: "portfolio", icon: FolderHeart, label: "Manage Portfolio" },
            { id: "testimonials", icon: MessageSquare, label: "Testimonials" },
            { id: "faqs", icon: HelpCircle, label: "Manage FAQs" },
            { id: "orders", icon: ShoppingBag, label: `Active Orders (${orders.length})` },
            { id: "contacts", icon: MessageSquare, label: `Contact Inbox (${contacts.length})` },
            { id: "users", icon: Users, label: `Registered Users (${users.length})` },
            { id: "settings", icon: Settings, label: "Website Settings" }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setEditingService(null);
                  setEditingPackage(null);
                  setEditingPortfolio(null);
                  setEditingTestimonial(null);
                  setEditingFaq(null);
                }}
                className={`w-full text-left p-3 rounded-xl text-xs font-medium tracking-wide flex items-center space-x-3 transition-all cursor-pointer focus:outline-none ${
                  isActive 
                    ? "bg-brand text-black font-black" 
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-black" : "text-brand"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Detail View Panel */}
        <div className="lg:col-span-9 bg-dark-card border border-dark-border rounded-3xl p-8 shadow-xl min-h-[60vh] relative">
          
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in" id="admin-subtab-overview">
              <h3 className="text-white font-display font-bold text-lg border-b border-dark-border pb-4 uppercase">
                System Health Summary
              </h3>

              {/* Bento counters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/40 border border-dark-border p-5 rounded-2xl relative">
                  <div className="absolute top-4 right-4 text-brand bg-brand/5 p-1.5 rounded-lg border border-brand/10">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">Registered Users</span>
                  <span className="text-3xl font-display font-bold text-white block mt-2">{users.length}</span>
                </div>
                
                <div className="bg-black/40 border border-dark-border p-5 rounded-2xl relative">
                  <div className="absolute top-4 right-4 text-brand bg-brand/5 p-1.5 rounded-lg border border-brand/10">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">Total Orders</span>
                  <span className="text-3xl font-display font-bold text-white block mt-2">{orders.length}</span>
                </div>

                <div className="bg-black/40 border border-dark-border p-5 rounded-2xl relative">
                  <div className="absolute top-4 right-4 text-brand bg-brand/5 p-1.5 rounded-lg border border-brand/10">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">Revenue Overview</span>
                  <span className="text-3xl font-display font-bold text-brand block mt-2">৳{totalCompletedRevenue}</span>
                </div>

                <div className="bg-black/40 border border-dark-border p-5 rounded-2xl relative">
                  <div className="absolute top-4 right-4 text-brand bg-brand/5 p-1.5 rounded-lg border border-brand/10">
                    <Database className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">Total Services</span>
                  <span className="text-3xl font-display font-bold text-white block mt-2">{services.length}</span>
                </div>
              </div>

              {/* Recent Orders Feed */}
              <div className="space-y-4 pt-4">
                <h4 className="text-xs font-mono tracking-widest text-zinc-400 uppercase">Recent Submissions</h4>
                <div className="border border-dark-border rounded-xl divide-y divide-dark-border bg-black/20 overflow-hidden">
                  {orders.slice(0, 3).map((ord) => (
                    <div key={ord.id} className="p-4 flex flex-col md:flex-row items-start justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">{ord.customerName}</span>
                          <span className="text-[10px] font-mono text-zinc-500">({ord.id})</span>
                          <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${
                            ord.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            ord.status === "active" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                            "bg-brand/10 text-brand border border-brand/20"
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-zinc-400 mt-1">{ord.serviceName} • <span className="font-mono text-brand">৳{ord.price}</span></p>
                      </div>
                      
                      <span className="text-zinc-500 font-mono text-[10px] whitespace-nowrap self-end md:self-center">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="p-6 text-center text-xs text-zinc-500 font-mono">No order records registered yet.</div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MANAGE SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-8 animate-fade-in" id="admin-subtab-services">
              <h3 className="text-white font-display font-bold text-lg border-b border-dark-border pb-4 uppercase">
                Service Capabilities Manager
              </h3>

              {/* Edit form */}
              {editingService ? (
                <form onSubmit={handleUpdateService} className="space-y-4 p-5 bg-black/30 border border-dark-border rounded-xl">
                  <h4 className="text-white font-display font-bold text-sm uppercase">Modify Service Properties</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Service Name</label>
                      <input 
                        type="text" 
                        required
                        value={editingService.name}
                        onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                        className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Lucide Icon</label>
                      <input 
                        type="text"
                        value={editingService.icon}
                        onChange={(e) => setEditingService({...editingService, icon: e.target.value})}
                        className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Unsplash Banner URL</label>
                    <input 
                      type="text" 
                      value={editingService.bannerUrl}
                      onChange={(e) => setEditingService({...editingService, bannerUrl: e.target.value})}
                      className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Short Description</label>
                    <input 
                      type="text" 
                      required
                      value={editingService.shortDescription}
                      onChange={(e) => setEditingService({...editingService, shortDescription: e.target.value})}
                      className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Exhaustive Description</label>
                    <textarea 
                      rows={3} 
                      value={editingService.description}
                      onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                      className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button type="submit" disabled={loading} className="bg-brand text-black py-2 px-5 rounded text-xs font-bold uppercase transition-colors">
                      Save Changes
                    </button>
                    <button type="button" onClick={() => setEditingService(null)} className="border border-dark-border hover:bg-white/5 py-2 px-5 rounded text-xs text-zinc-400">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleCreateService} className="space-y-4 p-5 bg-black/10 border border-dark-border rounded-xl">
                  <h4 className="text-white font-display font-bold text-sm uppercase">Add New Service Hub</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="e.g. Graphic Design" 
                      required
                      value={newSvcName}
                      onChange={(e) => setNewSvcName(e.target.value)}
                      className="bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand"
                    />
                    <input 
                      type="text" 
                      placeholder="Lucide Icon (Palette, Film, Monitor etc.)" 
                      value={newSvcIcon}
                      onChange={(e) => setNewSvcIcon(e.target.value)}
                      className="bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand font-mono"
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Short summary tagline for bento cards..." 
                    required
                    value={newSvcShortDesc}
                    onChange={(e) => setNewSvcShortDesc(e.target.value)}
                    className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand"
                  />
                  <input 
                    type="text" 
                    placeholder="Banner Background Image URL..." 
                    value={newSvcBanner}
                    onChange={(e) => setNewSvcBanner(e.target.value)}
                    className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand"
                  />
                  <textarea 
                    rows={2}
                    placeholder="Complete detailed service scope descriptions..." 
                    value={newSvcDesc}
                    onChange={(e) => setNewSvcDesc(e.target.value)}
                    className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand resize-none"
                  />
                  <button type="submit" disabled={loading} className="bg-brand text-black py-2 px-5 rounded text-xs font-black uppercase tracking-wider">
                    Add Service Hub
                  </button>
                </form>
              )}

              {/* Data Table */}
              <div className="border border-dark-border rounded-xl overflow-hidden bg-black/20">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#000000] text-[10px] font-mono tracking-widest uppercase text-zinc-500 border-b border-dark-border">
                    <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Slug</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {services.map((svc) => (
                      <tr key={svc.id}>
                        <td className="p-4 font-semibold text-white">{svc.name}</td>
                        <td className="p-4 font-mono">{svc.slug}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => setEditingService(svc)} className="p-1 text-zinc-400 hover:text-brand"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteService(svc.id)} className="p-1 text-zinc-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: MANAGE PACKAGES */}
          {activeTab === 'packages' && (
            <div className="space-y-8 animate-fade-in" id="admin-subtab-packages">
              <h3 className="text-white font-display font-bold text-lg border-b border-dark-border pb-4 uppercase">
                Dynamic Pricing Packages Manager
              </h3>

              {/* Edit Package form */}
              {editingPackage ? (
                <form onSubmit={handleUpdatePackage} className="space-y-4 p-5 bg-brand/5 border border-brand/20 rounded-xl relative">
                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <button 
                      type="button" 
                      onClick={() => handleAIOptimize(editingPackage)}
                      className="flex items-center space-x-1 py-1.5 px-3 rounded bg-brand text-black text-[10px] font-black uppercase tracking-widest"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Optimize with Gemini AI</span>
                    </button>
                  </div>

                  <h4 className="text-white font-display font-bold text-sm uppercase">Modify Pricing Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Package Name</label>
                      <input 
                        type="text" 
                        required
                        value={editingPackage.name}
                        onChange={(e) => setEditingPackage({...editingPackage, name: e.target.value})}
                        className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Rate (৳)</label>
                      <input 
                        type="number" 
                        required
                        value={editingPackage.price}
                        onChange={(e) => setEditingPackage({...editingPackage, price: Number(e.target.value)})}
                        className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Direct Target Service</label>
                      <select
                        value={editingPackage.serviceId}
                        onChange={(e) => setEditingPackage({...editingPackage, serviceId: e.target.value})}
                        className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none text-white font-mono"
                      >
                        {services.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Description</label>
                    <input 
                      type="text" 
                      required
                      value={editingPackage.description}
                      onChange={(e) => setEditingPackage({...editingPackage, description: e.target.value})}
                      className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Custom External Order/Billing Redirect URL (Optional)</label>
                    <input 
                      type="text" 
                      value={editingPackage.customOrderUrl || ""}
                      onChange={(e) => setEditingPackage({...editingPackage, customOrderUrl: e.target.value})}
                      placeholder="e.g. https://host.amarshebahost.com/cart.php?a=add&pid=X (replaces default WhatsApp odering flow)"
                      className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none font-mono"
                    />
                  </div>

                  {/* Feature lists editing */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Features (One per line)</label>
                    <textarea 
                      rows={4}
                      value={editingPackage.features.join("\n")}
                      onChange={(e) => setEditingPackage({...editingPackage, features: e.target.value.split("\n")})}
                      placeholder="Custom Logo design..."
                      className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none resize-none font-sans"
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button type="submit" disabled={loading} className="bg-brand text-black py-2 px-5 rounded text-xs font-bold uppercase">
                      Commit Parameters
                    </button>
                    <button type="button" onClick={() => setEditingPackage(null)} className="border border-dark-border hover:bg-white/5 py-2 px-5 rounded text-xs text-zinc-400">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleCreatePackage} className="space-y-4 p-5 bg-black/10 border border-dark-border rounded-xl">
                  <h4 className="text-white font-display font-bold text-sm uppercase">Add New Pricing Package</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      value={newPkgSvcId}
                      onChange={(e) => setNewPkgSvcId(e.target.value)}
                      className="bg-black border border-dark-border rounded px-3 py-2 text-xs text-white outline-none focus:border-brand"
                    >
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <input 
                      type="text" 
                      placeholder="e.g. Standard Package" 
                      required
                      value={newPkgName}
                      onChange={(e) => setNewPkgName(e.target.value)}
                      className="bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand"
                    />
                    <input 
                      type="number" 
                      placeholder="Price in Taka (৳)..." 
                      required
                      value={newPkgPrice}
                      onChange={(e) => setNewPkgPrice(Number(e.target.value))}
                      className="bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand font-mono"
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Short description of deliverables..." 
                    required
                    value={newPkgDesc}
                    onChange={(e) => setNewPkgDesc(e.target.value)}
                    className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand"
                  />
                  
                  <input 
                    type="text" 
                    placeholder="Custom External Order/Billing Redirect URL (Optional, e.g WHMCS cart link)..." 
                    value={newPkgCustomOrderUrl}
                    onChange={(e) => setNewPkgCustomOrderUrl(e.target.value)}
                    className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand font-mono"
                  />
                  
                  {/* Features inputs */}
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input 
                        type="text" 
                        placeholder="Add feature item (e.g. Unlimited Revisions)" 
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        className="flex-grow bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none"
                      />
                      <button type="button" onClick={handleAddFeature} className="bg-white/10 hover:bg-white/15 px-4 rounded text-xs text-white">Plus</button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      {newPkgFeatures.map((feat, idx) => (
                        <span key={idx} className="bg-brand/10 border border-brand/20 text-brand text-[10px] font-semibold py-1 px-2.5 rounded-md flex items-center space-x-1">
                          <span>{feat}</span>
                          <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-red-400 hover:text-red-500 font-bold ml-1 font-mono">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="bg-brand text-black py-2 px-5 rounded text-xs font-black uppercase tracking-wider">
                    Commit Package Options
                  </button>
                </form>
              )}

              {/* Data Table */}
              <div className="border border-dark-border rounded-xl overflow-hidden bg-black/20">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#000000] text-[10px] font-mono tracking-widest uppercase text-zinc-500 border-b border-dark-border">
                    <tr>
                      <th className="p-4">Package</th>
                      <th className="p-4">Mapped Service</th>
                      <th className="p-4">Rate</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {packages.map((pkg) => {
                      const hostService = services.find(s => s.id === pkg.serviceId)?.name || pkg.serviceId;
                      return (
                        <tr key={pkg.id}>
                          <td className="p-4 font-semibold text-white">{pkg.name}</td>
                          <td className="p-4 font-mono text-xs">{hostService}</td>
                          <td className="p-4 font-mono text-brand font-bold">৳{pkg.price}</td>
                          <td className="p-4">
                            <button
                              type="button"
                              onClick={() => handleTogglePackage(pkg)}
                              className="focus:outline-none cursor-pointer"
                              title="Click to toggle enabled/disabled status"
                            >
                              {pkg.enabled !== false ? (
                                <span className="bg-emerald-500/15 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center space-x-1 w-fit">
                                  <ToggleRight className="w-3.5 h-3.5" />
                                  <span>Enabled</span>
                                </span>
                              ) : (
                                <span className="bg-red-500/15 text-red-400 text-[9px] font-bold px-2 py-0.5 rounded border border-red-500/30 flex items-center space-x-1 w-fit">
                                  <ToggleLeft className="w-3.5 h-3.5" />
                                  <span>Disabled</span>
                                </span>
                              )}
                            </button>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => setEditingPackage(pkg)} className="p-1 text-zinc-400 hover:text-brand" title="Edit Properties"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleAIOptimize(pkg)} className="p-1 text-brand hover:scale-105" title="Gemini AI Optimize"><Sparkles className="w-4 h-4" /></button>
                            <button onClick={() => handleDeletePackage(pkg.id)} className="p-1 text-zinc-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 4: MANAGE PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div className="space-y-8 animate-fade-in" id="admin-subtab-portfolio">
              <h3 className="text-white font-display font-bold text-lg border-b border-dark-border pb-4 uppercase">
                Creative Portfolio Cases Manager
              </h3>

              {/* Edit form */}
              {editingPortfolio ? (
                <form onSubmit={handleUpdatePortfolio} className="space-y-4 p-5 bg-black/30 border border-dark-border rounded-xl">
                  <h4 className="text-white font-display font-bold text-sm uppercase">Modify Case Study</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Project Title</label>
                      <input 
                        type="text" 
                        required
                        value={editingPortfolio.title}
                        onChange={(e) => setEditingPortfolio({...editingPortfolio, title: e.target.value})}
                        className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Service Slot</label>
                      <select
                        value={editingPortfolio.serviceId}
                        onChange={(e) => setEditingPortfolio({...editingPortfolio, serviceId: e.target.value})}
                        className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none text-white font-mono"
                      >
                        {services.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Case Image URL</label>
                    <input 
                      type="text" 
                      required
                      value={editingPortfolio.imageUrl}
                      onChange={(e) => setEditingPortfolio({...editingPortfolio, imageUrl: e.target.value})}
                      className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Brief Description</label>
                    <textarea 
                      rows={2} 
                      value={editingPortfolio.description}
                      onChange={(e) => setEditingPortfolio({...editingPortfolio, description: e.target.value})}
                      className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button type="submit" disabled={loading} className="bg-brand text-black py-2 px-5 rounded text-xs font-bold uppercase">
                      Commit Case Study
                    </button>
                    <button type="button" onClick={() => setEditingPortfolio(null)} className="border border-dark-border hover:bg-white/5 py-2 px-5 rounded text-xs text-zinc-400">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleCreatePortfolio} className="space-y-4 p-5 bg-black/10 border border-dark-border rounded-xl">
                  <h4 className="text-white font-display font-bold text-sm uppercase">Add Portfolio Case Study</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      value={newPortSvcId}
                      onChange={(e) => setNewPortSvcId(e.target.value)}
                      className="bg-black border border-dark-border rounded px-3 py-2 text-xs text-white outline-none focus:border-brand"
                    >
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <input 
                      type="text" 
                      placeholder="e.g. Nova Finance Brand Identity" 
                      required
                      value={newPortTitle}
                      onChange={(e) => setNewPortTitle(e.target.value)}
                      className="bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand"
                    />
                    <input 
                      type="text" 
                      placeholder="Image Asset URL (Unsplash)..." 
                      required
                      value={newPortImage}
                      onChange={(e) => setNewPortImage(e.target.value)}
                      className="bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand"
                    />
                  </div>
                  <textarea 
                    rows={2}
                    placeholder="Brief architectural details of deliverables..." 
                    value={newPortDesc}
                    onChange={(e) => setNewPortDesc(e.target.value)}
                    className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand resize-none"
                  />
                  <button type="submit" disabled={loading} className="bg-brand text-black py-2 px-5 rounded text-xs font-black uppercase tracking-wider">
                    Add Ingested Case
                  </button>
                </form>
              )}

              {/* Data Table */}
              <div className="border border-dark-border rounded-xl overflow-hidden bg-black/20">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#000000] text-[10px] font-mono tracking-widest uppercase text-zinc-500 border-b border-dark-border">
                    <tr>
                      <th className="p-4">Title</th>
                      <th className="p-4">Assigned Service</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {portfolio.map((port) => {
                      const associatedSvc = services.find(s => s.id === port.serviceId)?.name || port.serviceId;
                      return (
                        <tr key={port.id}>
                          <td className="p-4 font-semibold text-white">{port.title}</td>
                          <td className="p-4 font-mono text-zinc-400">{associatedSvc}</td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => setEditingPortfolio(port)} className="p-1 text-zinc-400 hover:text-brand"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeletePortfolio(port.id)} className="p-1 text-zinc-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 5: MANAGING TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-8 animate-fade-in" id="admin-subtab-testimonials">
              <h3 className="text-white font-display font-bold text-lg border-b border-dark-border pb-4 uppercase">
                Client Endorsement Reviews manager
              </h3>

              {/* Edit form */}
              {editingTestimonial ? (
                <form onSubmit={handleUpdateTestimonial} className="space-y-4 p-5 bg-black/30 border border-dark-border rounded-xl">
                  <h4 className="text-white font-display font-bold text-sm uppercase">Modify Endorsement Parameter</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1 font-mono">Client Name</label>
                      <input 
                        type="text" 
                        required
                        value={editingTestimonial.clientName}
                        onChange={(e) => setEditingTestimonial({...editingTestimonial, clientName: e.target.value})}
                        className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1 font-mono">Client Role</label>
                      <input 
                        type="text" 
                        value={editingTestimonial.clientRole}
                        onChange={(e) => setEditingTestimonial({...editingTestimonial, clientRole: e.target.value})}
                        className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1 font-mono">Company Name</label>
                      <input 
                        type="text" 
                        value={editingTestimonial.company}
                        onChange={(e) => setEditingTestimonial({...editingTestimonial, company: e.target.value})}
                        className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1 font-mono">Stars (1-5)</label>
                      <input 
                        type="number" 
                        min={1} max={5}
                        value={editingTestimonial.rating}
                        onChange={(e) => setEditingTestimonial({...editingTestimonial, rating: Number(e.target.value)})}
                        className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1 font-mono">Comment Review Text</label>
                    <textarea 
                      rows={3} 
                      value={editingTestimonial.comment}
                      onChange={(e) => setEditingTestimonial({...editingTestimonial, comment: e.target.value})}
                      className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button type="submit" disabled={loading} className="bg-brand text-black py-2 px-5 rounded text-xs font-bold uppercase">
                      Commit Review
                    </button>
                    <button type="button" onClick={() => setEditingTestimonial(null)} className="border border-dark-border hover:bg-white/5 py-2 px-5 rounded text-xs text-zinc-400">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleCreateTestimonial} className="space-y-4 p-5 bg-black/10 border border-dark-border rounded-xl">
                  <h4 className="text-white font-display font-bold text-sm uppercase">Add Endorsement Review</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input 
                      type="text" 
                      placeholder="e.g. David Miller" 
                      required
                      value={newTestName}
                      onChange={(e) => setNewTestName(e.target.value)}
                      className="bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand"
                    />
                    <input 
                      type="text" 
                      placeholder="Operations VP..." 
                      value={newTestRole}
                      onChange={(e) => setNewTestRole(e.target.value)}
                      className="bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand"
                    />
                    <input 
                      type="text" 
                      placeholder="Company Name (Vortex Ltd)" 
                      value={newTestCompany}
                      onChange={(e) => setNewTestCompany(e.target.value)}
                      className="bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand"
                    />
                    <input 
                      type="number" 
                      min={1} max={5}
                      placeholder="Priority Stars (5)" 
                      value={newTestRating}
                      onChange={(e) => setNewTestRating(Number(e.target.value))}
                      className="bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand"
                    />
                  </div>
                  <textarea 
                    rows={2}
                    placeholder="Direct endorsement quote text..." 
                    value={newTestComment}
                    onChange={(e) => setNewTestComment(e.target.value)}
                    className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand resize-none"
                  />
                  <button type="submit" disabled={loading} className="bg-brand text-black py-2 px-5 rounded text-xs font-black uppercase tracking-wider">
                    Add Endorsement Review
                  </button>
                </form>
              )}

              {/* Data Table */}
              <div className="border border-dark-border rounded-xl overflow-hidden bg-black/20">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#000000] text-[10px] font-mono tracking-widest uppercase text-zinc-500 border-b border-dark-border">
                    <tr>
                      <th className="p-4">Evaluator</th>
                      <th className="p-4">Stars</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {testimonials.map((test) => (
                      <tr key={test.id}>
                        <td className="p-4 font-semibold text-white">{test.clientName} <span className="text-zinc-500 text-[10px] font-normal font-mono">({test.company})</span></td>
                        <td className="p-4 font-mono text-brand">{"★".repeat(test.rating)}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => setEditingTestimonial(test)} className="p-1 text-zinc-400 hover:text-brand"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteTestimonial(test.id)} className="p-1 text-zinc-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 6: MANAGE FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-8 animate-fade-in" id="admin-subtab-faqs">
              <h3 className="text-white font-display font-bold text-lg border-b border-dark-border pb-4 uppercase">
                General FAQ Manager
              </h3>

              {/* Edit form */}
              {editingFaq ? (
                <form onSubmit={handleUpdateFaq} className="space-y-4 p-5 bg-black/30 border border-dark-border rounded-xl">
                  <h4 className="text-white font-display font-bold text-sm uppercase">Modify FAQ Parameter</h4>
                  
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Question</label>
                    <input 
                      type="text" 
                      required
                      value={editingFaq.question}
                      onChange={(e) => setEditingFaq({...editingFaq, question: e.target.value})}
                      className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Answer explanation</label>
                    <textarea 
                      rows={3} 
                      value={editingFaq.answer}
                      onChange={(e) => setEditingFaq({...editingFaq, answer: e.target.value})}
                      className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs focus:border-brand outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button type="submit" disabled={loading} className="bg-brand text-black py-2 px-5 rounded text-xs font-bold uppercase font-mono">
                      Overwrites FAQ
                    </button>
                    <button type="button" onClick={() => setEditingFaq(null)} className="border border-dark-border hover:bg-white/5 py-2 px-5 rounded text-xs text-zinc-400">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleCreateFaq} className="space-y-4 p-5 bg-black/10 border border-dark-border rounded-xl">
                  <h4 className="text-white font-display font-bold text-sm uppercase">Add Dynamic FAQ</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Frequently Asked Question?" 
                      required
                      value={newFaqQ}
                      onChange={(e) => setNewFaqQ(e.target.value)}
                      className="bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand"
                    />
                    <select
                      value={newFaqSvc}
                      onChange={(e) => setNewFaqSvc(e.target.value)}
                      className="bg-black border border-dark-border rounded px-3 py-2 text-xs text-white outline-none focus:border-brand"
                    >
                      <option value="general">Assigned to General Pages</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>Link to {s.name}</option>
                      ))}
                    </select>
                  </div>
                  <textarea 
                    rows={2}
                    placeholder="Elaborated conversion answer text..." 
                    value={newFaqA}
                    onChange={(e) => setNewFaqA(e.target.value)}
                    className="w-full bg-black border border-dark-border rounded px-3 py-2 text-xs outline-none focus:border-brand resize-none"
                  />
                  <button type="submit" disabled={loading} className="bg-brand text-black py-2 px-5 rounded text-xs font-black uppercase tracking-wider">
                    Add MCQ FAQ
                  </button>
                </form>
              )}

              {/* Data Table */}
              <div className="border border-dark-border rounded-xl overflow-hidden bg-black/20">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#000000] text-[10px] font-mono tracking-widest uppercase text-zinc-500 border-b border-dark-border">
                    <tr>
                      <th className="p-4">Question</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {faqs.map((faq) => (
                      <tr key={faq.id}>
                        <td className="p-4 font-semibold text-white truncate max-w-sm">{faq.question}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => setEditingFaq(faq)} className="p-1 text-zinc-400 hover:text-brand"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteFaq(faq.id)} className="p-1 text-zinc-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 7: MANAGER ACTIVE ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in" id="admin-subtab-orders">
              <h3 className="text-white font-display font-bold text-lg border-b border-dark-border pb-4 uppercase">
                Active Client Orders Pipeline ({orders.length})
              </h3>

              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="bg-black/30 border border-dark-border rounded-xl p-6 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-dark-border/40 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-white font-bold font-display text-sm">{ord.customerName}</h4>
                          <span className="text-[10px] font-mono text-zinc-500">({ord.id})</span>
                        </div>
                        <p className="text-xs text-zinc-400 font-mono mt-0.5">{ord.email} • WhatsApp: {ord.phone}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[9px] uppercase font-mono font-bold tracking-widest py-1 px-3 rounded-md border ${
                          ord.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          ord.status === "active" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                          ord.status === "cancelled" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                          "bg-brand/10 text-brand border-brand/20"
                        }`}>
                          ● STATUS: {ord.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono leading-relaxed mt-2 text-zinc-300">
                      <div>
                        <span className="text-[9px] text-zinc-500 block">DELIVERABLE & TIER</span>
                        <p className="text-white font-sans mt-0.5">{ord.serviceName} • {ord.packageName}</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 block">DEAL RATE</span>
                        <p className="text-brand font-bold mt-0.5">৳{ord.price}</p>
                      </div>
                    </div>

                    <div className="bg-black/50 p-4 rounded-lg text-xs leading-relaxed">
                      <span className="text-[9px] text-zinc-500 block uppercase font-mono mb-1">Customer Brief Notes</span>
                      <p className="text-zinc-300 font-light italic">
                        {ord.projectDetails || "No special instructions provided."}
                      </p>
                    </div>

                    {/* Operational Status buttons */}
                    <div className="flex flex-wrap items-center justify-between pt-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, "active")}
                          className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 py-1.5 px-3 rounded text-[10px] font-bold uppercase transition"
                        >
                          Mark Active
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, "completed")}
                          className="bg-emerald-500/15 hover:bg-emerald-500/20 text-emerald-400 py-1.5 px-3 rounded text-[10px] font-bold uppercase transition"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, "cancelled")}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 py-1.5 px-3 rounded text-[10px] font-bold uppercase transition"
                        >
                          Cancel order
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteOrder(ord.id)}
                        className="py-1 px-2 border border-red-500/20 hover:bg-red-500/25 text-red-500 rounded text-[10px]"
                      >
                        Delete Record
                      </button>
                    </div>
                  </div>
                ))}

                {orders.length === 0 && (
                  <div className="p-12 text-center text-xs text-zinc-500 font-mono border border-dashed border-dark-border rounded-xl">
                    No historic orders recorded. Client submissions from service checkout grids list dynamically.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 8: MANAGING CONTACT INBOX */}
          {activeTab === 'contacts' && (
            <div className="space-y-6 animate-fade-in" id="admin-subtab-contacts">
              <h3 className="text-white font-display font-bold text-lg border-b border-dark-border pb-4 uppercase">
                Customer Live Contact Inbox ({contacts.length})
              </h3>

              <div className="space-y-4">
                {contacts.map((c) => (
                  <div key={c.id} className="bg-black/30 border border-dark-border rounded-xl p-5 space-y-3 relative">
                    <div className="flex items-start justify-between border-b border-dark-border/40 pb-2 gap-4">
                      <div>
                        <h4 className="text-white font-bold font-display text-sm">{c.name}</h4>
                        <p className="text-[10px] text-zinc-400 font-mono tracking-wide mt-1">
                          {c.email} • WhatsApp: {c.phone || "N/A"}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        {c.status === "unread" ? (
                          <span className="bg-orange-500/10 text-brand text-[9px] font-black px-2 py-0.5 rounded uppercase font-mono border border-brand/20">
                            UNREAD INQUIRY
                          </span>
                        ) : (
                          <span className="bg-zinc-800 text-zinc-400 text-[9px] font-semibold px-2 py-0.5 rounded uppercase font-mono">
                            ARCHIVED
                          </span>
                        )}
                        
                        <button
                          onClick={() => handleDeleteContact(c.id)}
                          className="p-1 text-zinc-500 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs leading-relaxed text-zinc-300">
                      <span className="text-[9px] text-zinc-500 block font-mono">Message Brief Description:</span>
                      <p className="mt-1 font-light italic">{c.message}</p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-dark-border/20">
                      <span>Submitted: {new Date(c.createdAt).toLocaleString()}</span>
                      
                      {c.status === "unread" && (
                        <button
                          onClick={() => handleMarkContactRead(c.id)}
                          className="bg-brand/10 hover:bg-brand text-brand hover:text-black py-1.5 px-3 rounded text-[9px] font-bold uppercase transition focus:outline-none"
                        >
                          Mark Reviewed
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {contacts.length === 0 && (
                  <div className="p-12 text-center text-xs text-zinc-500 font-mono border border-dashed border-dark-border rounded-xl animate-pulse">
                    Inbox empty. Submissions from standard Contact Us brief forms map here in real time.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 9: REGISTERED USERS LIST */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in" id="admin-subtab-users">
              <h3 className="text-white font-display font-bold text-lg border-b border-dark-border pb-4 uppercase">
                Registered Client Credentials Database ({users.length})
              </h3>

              <div className="border border-dark-border rounded-xl overflow-hidden bg-black/20">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#000000] text-[10px] font-mono tracking-widest uppercase text-zinc-500 border-b border-dark-border">
                    <tr>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role Tag</th>
                      <th className="p-4">Phone contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="p-4 font-semibold text-white">{u.name}</td>
                        <td className="p-4 font-mono">{u.email}</td>
                        <td className="p-4 font-mono">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase ${
                            u.role === "admin" ? "bg-red-500/10 text-red-400" : "bg-brand/10 text-brand"
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-zinc-400">{u.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 10: WEBSITE GENERAL SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSettingsSubmit} className="space-y-6 animate-fade-in" id="admin-subtab-settings">
              <h3 className="text-white font-display font-bold text-lg border-b border-dark-border pb-4 uppercase">
                Agency Credentials & SEO Configurations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                    HQ Coordinates / Address
                  </label>
                  <input 
                    type="text" 
                    required
                    value={currentSettings.address}
                    onChange={(e) => setCurrentSettings({...currentSettings, address: e.target.value})}
                    placeholder="Kishoreganj-2380"
                    className="w-full bg-black border border-dark-border focus:border-brand rounded-xl py-3 px-4 text-sm text-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                    WhatsApp Hotline Contact
                  </label>
                  <input 
                    type="text" 
                    required
                    value={currentSettings.whatsapp}
                    onChange={(e) => setCurrentSettings({...currentSettings, whatsapp: e.target.value})}
                    placeholder="01837679963"
                    className="w-full bg-black border border-dark-border focus:border-brand rounded-xl py-3 px-4 text-sm text-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Dynamic Typography Overrides */}
              <div className="space-y-4 pt-4 border-t border-dark-border/40">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">A-Z Landing Page Copy Overrides</span>
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                    Hero Main Title
                  </label>
                  <input 
                    type="text" 
                    value={currentSettings.heroTitle || ""}
                    onChange={(e) => setCurrentSettings({...currentSettings, heroTitle: e.target.value})}
                    placeholder="Grow Your Business With Professional Digital Services"
                    className="w-full bg-black border border-dark-border focus:border-brand rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                    Hero Subtitle / Narrative Description
                  </label>
                  <textarea 
                    rows={2}
                    value={currentSettings.heroSubtitle || ""}
                    onChange={(e) => setCurrentSettings({...currentSettings, heroSubtitle: e.target.value})}
                    placeholder="We provide world class graphic design, video editing..."
                    className="w-full bg-black border border-dark-border focus:border-brand rounded-xl py-3 px-4 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                      About Us Section Title
                    </label>
                    <input 
                      type="text" 
                      value={currentSettings.aboutTitle || ""}
                      onChange={(e) => setCurrentSettings({...currentSettings, aboutTitle: e.target.value})}
                      placeholder="THE DIGITAL ARCHITECT CREW"
                      className="w-full bg-black border border-dark-border focus:border-brand rounded-xl py-3 px-4 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                      About Us Narrative Context
                    </label>
                    <textarea 
                      rows={2}
                      value={currentSettings.aboutContent || ""}
                      onChange={(e) => setCurrentSettings({...currentSettings, aboutContent: e.target.value})}
                      placeholder="Founded initially as a micro visual group in Jamtoli, Austagram..."
                      className="w-full bg-black border border-dark-border focus:border-brand rounded-xl py-3 px-4 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* EDITORIAL WEB ASSETS & AGENCY PHOTOS */}
              <div className="space-y-4 pt-4 border-t border-dark-border/40 bg-zinc-950/20 p-4 rounded-xl border border-dark-border/40">
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand block font-semibold">Editorial Web Assets & Photos</span>
                <p className="text-[11px] text-zinc-500">
                  Update major visuals used across the landing screen and metadata sections. Customize URLs to point to any online photo asset.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1 font-mono">
                      Website Logo URL
                    </label>
                    <input 
                      type="text" 
                      value={currentSettings.logoImageUrl || ""}
                      onChange={(e) => setCurrentSettings({...currentSettings, logoImageUrl: e.target.value})}
                      placeholder="e.g. https://domain.com/logo.png"
                      className="w-full bg-black border border-dark-border focus:border-brand rounded-lg py-2 px-3 text-xs text-white focus:outline-none font-mono"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">Leave blank to default to text 'PIXEL AGENCY' logo.</p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1 font-mono">
                      Hero Section Cover URL
                    </label>
                    <input 
                      type="text" 
                      value={currentSettings.heroImageUrl || ""}
                      onChange={(e) => setCurrentSettings({...currentSettings, heroImageUrl: e.target.value})}
                      placeholder="e.g. https://unsplash.com/photo..."
                      className="w-full bg-black border border-dark-border focus:border-brand rounded-lg py-2 px-3 text-xs text-white focus:outline-none font-mono"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">Gives the primary landing background illustrative ambient texture.</p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1 font-mono">
                      About Us Narrative Cover URL
                    </label>
                    <input 
                      type="text" 
                      value={currentSettings.aboutImageUrl || ""}
                      onChange={(e) => setCurrentSettings({...currentSettings, aboutImageUrl: e.target.value})}
                      placeholder="e.g. https://unsplash.com/about..."
                      className="w-full bg-black border border-dark-border focus:border-brand rounded-lg py-2 px-3 text-xs text-white focus:outline-none font-mono"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">Renders elegantly as a high-contrast visual alongside narrative.</p>
                  </div>
                </div>
              </div>

              {/* HEADER PRIMARY NAVIGATION MENUS */}
              <div className="space-y-4 pt-4 border-t border-dark-border/40 bg-zinc-950/20 p-4 rounded-xl border border-dark-border/40">
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand block font-semibold">Custom Header Navigation Menu Links</span>
                <p className="text-[11px] text-zinc-500">
                  Configure additional custom menu links that appear in the primary navigation list of the header. Keep them concise (1-2 words).
                </p>

                {/* List of Registered Menu Links */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">Currently Configured Menus ({currentSettings.customMenuItems?.length || 0})</span>
                  {(!currentSettings.customMenuItems || currentSettings.customMenuItems.length === 0) ? (
                    <div className="text-zinc-500 text-xs font-mono italic p-3 bg-black/40 border border-dark-border/20 rounded-md">
                      No custom navigation menu links registered. Only standard page items (Home, Services, Domain & Hosting, About Us, Contact) are visible.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {currentSettings.customMenuItems.map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between gap-3 p-3 bg-black/50 border border-dark-border/40 rounded-lg">
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <span className="text-[11px] font-mono text-zinc-500">#{index + 1}</span>
                            <div className="overflow-hidden">
                              <span className="text-xs font-semibold text-brand font-mono">{item.label}</span>
                              <span className="text-[10px] text-zinc-400 font-mono block truncate max-w-[200px] sm:max-w-md">{item.url} {item.isExternal ? "(External ↗)" : "(Internal)"}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 shrink-0">
                            <button 
                              type="button"
                              disabled={index === 0}
                              onClick={() => {
                                const list = [...(currentSettings.customMenuItems || [])];
                                const temp = list[index];
                                list[index] = list[index - 1];
                                list[index - 1] = temp;
                                setCurrentSettings({...currentSettings, customMenuItems: list});
                              }}
                              className="p-1 text-zinc-400 hover:text-brand disabled:opacity-20 cursor-pointer font-mono text-[9px]"
                            >
                              ▲ UP
                            </button>
                            <button 
                              type="button"
                              disabled={index === (currentSettings.customMenuItems || []).length - 1}
                              onClick={() => {
                                const list = [...(currentSettings.customMenuItems || [])];
                                const temp = list[index];
                                list[index] = list[index + 1];
                                list[index + 1] = temp;
                                setCurrentSettings({...currentSettings, customMenuItems: list});
                              }}
                              className="p-1 text-zinc-400 hover:text-brand disabled:opacity-20 cursor-pointer font-mono text-[9px]"
                            >
                              ▼ DWN
                            </button>
                            <button 
                              type="button"
                              onClick={() => {
                                const list = (currentSettings.customMenuItems || []).filter(m => m.id !== item.id);
                                setCurrentSettings({...currentSettings, customMenuItems: list});
                              }}
                              className="p-1 px-2 text-red-500 hover:bg-red-500/10 rounded font-mono text-[9px]"
                            >
                              DEL
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add New Menu Link Form */}
                <div className="border-t border-dark-border/20 pt-4 mt-2 space-y-3">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">Register Instant Custom Menu Item</span>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">
                        Link Text / Label Name
                      </label>
                      <input 
                        type="text" 
                        value={newMenuLabel}
                        onChange={(e) => setNewMenuLabel(e.target.value)}
                        placeholder="e.g. Live Status"
                        className="w-full bg-black border border-dark-border focus:border-brand rounded-md py-1.5 px-3 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">
                        Redirect Target URL
                      </label>
                      <input 
                        type="text" 
                        value={newMenuUrl}
                        onChange={(e) => setNewMenuUrl(e.target.value)}
                        placeholder="e.g. https://status.yourdomain.com"
                        className="w-full bg-black border border-dark-border focus:border-brand rounded-md py-1.5 px-3 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">
                        Link Behavior
                      </label>
                      <select 
                        value={newMenuIsExternal ? "true" : "false"}
                        onChange={(e) => setNewMenuIsExternal(e.target.value === "true")}
                        className="w-full bg-black border border-dark-border focus:border-brand rounded-md py-1.5 px-3 text-xs text-white focus:outline-none font-mono"
                      >
                        <option value="true">New Tab (External)</option>
                        <option value="false">Self Frame (Internal)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!newMenuLabel.trim() || !newMenuUrl.trim()) return;
                          const list = [...(currentSettings.customMenuItems || [])];
                          list.push({
                            id: "menu-" + Math.random().toString(36).substring(2, 9),
                            label: newMenuLabel.trim(),
                            url: newMenuUrl.trim(),
                            isExternal: newMenuIsExternal,
                            order: list.length + 1
                          });
                          setCurrentSettings({...currentSettings, customMenuItems: list});
                          setNewMenuLabel("");
                          setNewMenuUrl("");
                        }}
                        className="w-full py-2 px-4 bg-brand hover:bg-brand-hover text-black hover:text-black font-extrabold uppercase font-mono tracking-wider rounded text-[10px] transition-colors"
                      >
                        APPEND LINK
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* DOMAIN & HOSTING PORTAL SETTINGS */}
              <div className="space-y-4 pt-4 border-t border-dark-border/40 bg-zinc-950/20 p-4 rounded-xl border border-dark-border/40">
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand block font-semibold">Domain & Hosting Configurations</span>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                    Registrar / Domain Search External Target URL
                  </label>
                  <p className="text-[11px] text-zinc-500 mb-2">
                    When visitors query a domain name, this is the portal URL where they will be redirected to view price list & complete purchase. (Default: <code>https://host.amarshebahost.com/cart.php?a=add&domain=register&query=</code>)
                  </p>
                  <input 
                    type="text" 
                    value={currentSettings.domainRegistrationUrl || ""}
                    onChange={(e) => setCurrentSettings({...currentSettings, domainRegistrationUrl: e.target.value})}
                    placeholder="https://host.amarshebahost.com/cart.php?a=add&domain=register&query="
                    className="w-full bg-black border border-dark-border focus:border-brand rounded-xl py-3 px-4 text-xs text-white focus:outline-none font-mono"
                  />
                </div>

                <div className="border-t border-dark-border/20 pt-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-3 font-semibold">
                    Interactive Navigation Dropdown Sub-links (Target Redirection Addresses)
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "BDIX Hosting Target Link", key: "bdixHostingUrl" },
                      { label: "USA Hosting Target Link", key: "usaHostingUrl" },
                      { label: "Singapore Hosting Target Link", key: "singaporeHostingUrl" },
                      { label: "Germany Hosting Target Link", key: "germanyHostingUrl" },
                      { label: "BDIX Reseller Host Target Link", key: "bdixResellerUrl" },
                      { label: "USA Reseller Host Target Link", key: "usaResellerUrl" },
                      { label: "Singapore Reseller Host Target Link", key: "singaporeResellerUrl" },
                      { label: "Germany Reseller Host Target Link", key: "germanyResellerUrl" },
                      { label: "Domain Pricing Target Link", key: "domainPricingUrl" },
                      { label: "Domain Transfer Target Link", key: "domainTransferUrl" },
                      { label: "Domain Dns Checker Target Link", key: "domainDnsCheckerUrl" }
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                          {field.label}
                        </label>
                        <input 
                          type="text" 
                          value={(currentSettings as any)[field.key] || ""}
                          onChange={(e) => setCurrentSettings({...currentSettings, [field.key]: e.target.value})}
                          placeholder="e.g. https://host.amarshebahost.com/..."
                          className="w-full bg-black border border-dark-border focus:border-brand rounded-lg py-2 px-3 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SEO inputs */}
              <div className="space-y-4 pt-4 border-t border-dark-border/40">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">SEO Tags overrides</span>
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                    SEO Meta Title
                  </label>
                  <input 
                    type="text" 
                    required
                    value={currentSettings.seoTitle}
                    onChange={(e) => setCurrentSettings({...currentSettings, seoTitle: e.target.value})}
                    placeholder="Meta Title Tag"
                    className="w-full bg-black border border-dark-border focus:border-brand rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                      SEO Keywords (comma separated)
                    </label>
                    <input 
                      type="text" 
                      required
                      value={currentSettings.seoKeywords}
                      onChange={(e) => setCurrentSettings({...currentSettings, seoKeywords: e.target.value})}
                      placeholder="design, video editing, web design..."
                      className="w-full bg-black border border-dark-border focus:border-brand rounded-xl py-3 px-4 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                      SEO Meta Description
                    </label>
                    <input 
                      type="text" 
                      required
                      value={currentSettings.seoDescription}
                      onChange={(e) => setCurrentSettings({...currentSettings, seoDescription: e.target.value})}
                      placeholder="World class graphic design, high retention videos..."
                      className="w-full bg-black border border-dark-border focus:border-brand rounded-xl py-3 px-4 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic SQL Database Configuration Section */}
              <div className="space-y-4 pt-6 border-t border-dark-border/40">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand block font-semibold">CUSTOM RELATIONAL DATABASE CONNECTION SYSTEM</span>
                    <h4 className="text-sm font-bold text-white font-display mt-0.5">EXTERNAL / LOCAL SQL SYNC</h4>
                  </div>
                  
                  {/* Switch to enable/disable SQL auto sync */}
                  <div className="flex items-center space-x-3 bg-zinc-950 p-2 rounded-xl border border-dark-border">
                    <span className="text-[10px] font-mono text-zinc-400">Live Auto-Sync:</span>
                    <button
                      type="button"
                      onClick={() => setCurrentSettings({ ...currentSettings, sqlEnabled: !currentSettings.sqlEnabled })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        currentSettings.sqlEnabled ? "bg-brand" : "bg-zinc-800"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                          currentSettings.sqlEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <p className="text-zinc-400 text-xs tracking-normal leading-relaxed">
                  Provide credentials for any public or localhost-tunneled SQL database server (PostgreSQL or MySQL). When enabled, any visual adjustments, custom services, reviews, orders, or comments updated in the agency's administrator dashboards will automatically propagate inside your SQL engine tables in real-time.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                      SQL Database Engine Dialect
                    </label>
                    <select
                      value={currentSettings.sqlDialect || "postgres"}
                      onChange={(e) => setCurrentSettings({ ...currentSettings, sqlDialect: e.target.value as "postgres" | "mysql" })}
                      className="w-full bg-black border border-dark-border focus:border-brand rounded-xl py-3 px-4 text-xs text-white focus:outline-none"
                    >
                      <option value="postgres">PostgreSQL engine</option>
                      <option value="mysql">MySQL / MariaDB engine</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                      Database Connection URI link (Postgres or MySQL standard connection string)
                    </label>
                    <input
                      type="text"
                      value={currentSettings.sqlConnectionUri || ""}
                      onChange={(e) => setCurrentSettings({ ...currentSettings, sqlConnectionUri: e.target.value })}
                      placeholder="e.g. postgres://username:password@hostname:5432/databasename"
                      className="w-full bg-black border border-dark-border focus:border-brand rounded-xl py-3 px-4 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* SQL status and action messages */}
                {sqlMessage && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded-lg transition-all animate-fade-in">
                    {sqlMessage}
                  </div>
                )}
                {sqlError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono rounded-lg transition-all animate-fade-in">
                    {sqlError}
                  </div>
                )}

                {/* Action button grids */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <button
                    type="button"
                    disabled={sqlTesting}
                    onClick={handleTestSqlConnection}
                    className="py-2.5 px-4 bg-zinc-950 border border-dark-border text-[10px] font-mono uppercase tracking-widest text-zinc-300 rounded-lg hover:border-brand/40 text-center transition-all hover:bg-zinc-900 cursor-pointer disabled:opacity-50"
                  >
                    {sqlTesting ? "Connecting..." : "🔍 TEST CONNECTION"}
                  </button>

                  <button
                    type="button"
                    disabled={sqlTesting}
                    onClick={handleSyncToSql}
                    className="py-2.5 px-4 bg-brand/10 border border-brand/30 text-[10px] font-mono uppercase tracking-widest text-brand rounded-lg hover:bg-brand/25 text-center transition-all cursor-pointer disabled:opacity-50"
                  >
                    {sqlTesting ? "Syncing snapshot..." : "📤 SYNC DATA TO SQL"}
                  </button>

                  <button
                    type="button"
                    disabled={sqlTesting}
                    onClick={handleSyncFromSql}
                    className="py-2.5 px-4 bg-purple-500/10 border border-purple-500/30 text-[10px] font-mono uppercase tracking-widest text-purple-400 rounded-lg hover:bg-purple-500/20 text-center transition-all cursor-pointer disabled:opacity-50"
                  >
                    {sqlTesting ? "Pulling DB..." : "📥 SYNC DATA FROM SQL"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-brand text-black py-3 px-8 rounded-xl font-bold font-display tracking-widest text-xs uppercase"
              >
                {loading ? "Re-binding variables..." : "OVERWRITE WEBSITE PARAMETERS"}
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
