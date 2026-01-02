import React from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, UserCheck, Database, Bell } from "lucide-react";

const PrivacyPolicy: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 mx-auto text-primary mb-4" />
          <h1 className="font-serif text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last Updated: January 2025 • Effective under the Digital Personal Data Protection Act, 2023
          </p>
        </div>

        <div className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                1. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p>In accordance with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023, we collect:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and address when you create an account.</li>
                <li><strong>Case Information:</strong> Details of legal matters you submit including incident descriptions, dates, and locations.</li>
                <li><strong>Uploaded Documents:</strong> Evidence files, legal documents, and photographs you upload for case analysis.</li>
                <li><strong>Communication Data:</strong> Chat conversations with our AI legal assistant.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and device information for security purposes.</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                2. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To provide AI-powered legal guidance and case analysis services.</li>
                <li>To generate legal documents such as FIR drafts and complaints.</li>
                <li>To match you with qualified legal professionals when requested.</li>
                <li>To improve our AI models and service quality (anonymized data only).</li>
                <li>To comply with legal obligations under Indian law.</li>
                <li>To prevent fraud and ensure platform security.</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                3. Data Storage & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p className="text-muted-foreground">
                Your data is stored securely in compliance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>All data is encrypted at rest and in transit using industry-standard encryption.</li>
                <li>Access to personal data is restricted to authorized personnel only.</li>
                <li>Regular security audits and vulnerability assessments are conducted.</li>
                <li>Data is stored on secure servers with multiple layers of protection.</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                4. Your Rights Under Indian Law
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p className="text-muted-foreground">Under the Digital Personal Data Protection Act, 2023, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Access:</strong> Request a copy of your personal data we hold.</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data.</li>
                <li><strong>Grievance Redressal:</strong> Lodge a complaint with the Data Protection Board of India.</li>
                <li><strong>Nominate:</strong> Nominate an individual to exercise your rights in case of death or incapacity.</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                5. Data Retention & Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>We retain your data for as long as necessary to provide our services or as required by law.</li>
                <li>Case data may be retained for legal compliance periods as mandated under the Limitation Act, 1963.</li>
                <li>We may disclose data when required by court order, summons, or government authority under lawful process.</li>
                <li>Anonymized data may be used for research and service improvement.</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="parchment" className="text-center">
            <CardContent className="py-8">
              <p className="text-secondary-foreground mb-4">
                For privacy-related queries or to exercise your data rights, contact us at:
              </p>
              <p className="font-semibold text-secondary-foreground">
                Email: privacy@lexaailawyer.in
              </p>
              <p className="text-secondary-foreground text-sm mt-2">
                Data Protection Officer: As appointed under DPDP Act, 2023
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
