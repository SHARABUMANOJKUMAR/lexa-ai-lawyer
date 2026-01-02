import React from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, UserCheck, Bell } from "lucide-react";

const PrivacyPolicy: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 mx-auto text-primary mb-4" />
            <h1 className="font-serif text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last Updated: January 2025
            </p>
          </div>

          <div className="space-y-8">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Eye className="w-5 h-5 text-primary" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>
                  Welcome to AI LeXa Lawyer - Smart Judiciary of India. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered legal guidance platform.
                </p>
                <p>
                  By using our services, you consent to the data practices described in this policy. If you do not agree with the terms of this privacy policy, please do not access the platform.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Database className="w-5 h-5 text-primary" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <h4>Personal Information</h4>
                <ul>
                  <li>Name, email address, and contact information provided during registration</li>
                  <li>Authentication credentials and account preferences</li>
                  <li>Profile information you choose to provide</li>
                </ul>
                
                <h4>Case-Related Information</h4>
                <ul>
                  <li>Legal case details and descriptions you submit</li>
                  <li>Evidence documents and files you upload</li>
                  <li>FIR drafts and legal documents generated</li>
                  <li>Chat conversations with our AI legal assistant</li>
                </ul>
                
                <h4>Technical Information</h4>
                <ul>
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                  <li>Usage patterns and interaction data</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Lock className="w-5 h-5 text-primary" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>We use the collected information for the following purposes:</p>
                <ul>
                  <li>Providing AI-powered legal guidance and document generation services</li>
                  <li>Processing and managing your legal cases and FIR drafts</li>
                  <li>Improving our AI models to provide better legal assistance</li>
                  <li>Communicating with you about your cases and platform updates</li>
                  <li>Ensuring platform security and preventing fraud</li>
                  <li>Complying with legal obligations under Indian law</li>
                  <li>Conducting research to improve legal accessibility in India</li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <UserCheck className="w-5 h-5 text-primary" />
                  Data Protection & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul>
                  <li>End-to-end encryption for all data transmissions</li>
                  <li>Secure cloud storage with access controls</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Employee training on data protection practices</li>
                  <li>Compliance with Information Technology Act, 2000 and IT Rules, 2011</li>
                </ul>
                <p>
                  While we strive to protect your information, no method of transmission over the Internet is 100% secure. We encourage you to use strong passwords and keep your login credentials confidential.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Bell className="w-5 h-5 text-primary" />
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>Under applicable Indian data protection laws, you have the right to:</p>
                <ul>
                  <li>Access your personal data held by us</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data (subject to legal requirements)</li>
                  <li>Withdraw consent for data processing</li>
                  <li>File a complaint with relevant authorities</li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us at sharabumanojachari@gmail.com. We will respond to your request within 30 days.
                </p>
              </CardContent>
            </Card>

            <Card variant="parchment">
              <CardContent className="pt-6">
                <p className="text-sm text-secondary-foreground">
                  <strong>Contact Us:</strong> If you have any questions about this Privacy Policy, please contact us at sharabumanojachari@gmail.com or through our platform support.
                </p>
                <p className="text-sm text-secondary-foreground mt-4">
                  <strong>Governing Law:</strong> This Privacy Policy is governed by the laws of India, including the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
