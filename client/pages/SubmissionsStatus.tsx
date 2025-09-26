import { useState, useEffect } from "react";
import { api } from "@/api/api";
import { DataSubmission } from "@shared/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Calendar,
  Plus,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";

export default function SubmissionsStatus() {
  const [submissions, setSubmissions] = useState<DataSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const response = await api.get("/submissions");
      setSubmissions(response.data.submissions);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending Review
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Submissions Status</h1>
          <p className="text-gray-600 mt-2">
            Track the status of your submitted data and create new submissions
          </p>
        </div>
        
        <Link to="/upload">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Submission
          </Button>
        </Link>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {submissions.filter(s => s.status === "pending").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {submissions.filter(s => s.status === "approved").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {submissions.filter(s => s.status === "rejected").length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No submissions yet</h3>
              <p className="text-gray-600">Create your first data submission to get started.</p>
              <Link to="/upload">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Submission
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          submissions.map((submission) => (
            <Card
              key={submission.id}
              className={`border-l-4 ${
                submission.status === "approved"
                  ? "border-l-green-400"
                  : submission.status === "rejected"
                  ? "border-l-red-400"
                  : "border-l-yellow-400"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {submission.title}
                      {getStatusBadge(submission.status)}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {submission.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Type: {submission.dataType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Submitted: {formatDate(submission.submittedAt)}</span>
                  </div>
                  {submission.reviewedAt && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Reviewed: {formatDate(submission.reviewedAt)}</span>
                    </div>
                  )}
                </div>

                {submission.reviewNotes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <h4 className="font-medium text-gray-900 mb-1">Review Notes:</h4>
                    <p className="text-sm text-gray-700">{submission.reviewNotes}</p>
                  </div>
                )}

                {submission.attachments && submission.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Attachments ({submission.attachments.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {submission.attachments.map((attachment, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          📎 {attachment.split("/").pop()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}