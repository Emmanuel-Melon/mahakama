import { useState } from "react";
import { ArrowLeft, Phone, Mail, Globe, MapPin, Clock, Users, FileText } from "lucide-react";
import { Button } from "~/components/ui/button";
import { PageLayout } from "~/layouts/page-layout";
import type { LegalService } from "~/feature/website/hooks/use-services";

interface ServiceDetailScreenProps {
  service: LegalService;
  onBack?: () => void;
}

export function ServiceDetailScreen({ service, onBack }: ServiceDetailScreenProps) {
  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-8">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
            <p className="text-gray-600 mt-1">{service.category}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Service</h2>
            <p className="text-gray-700 leading-relaxed">{service.description}</p>
          </div>

          {/* Services Offered */}
          {service.services && Array.isArray(service.services) && service.services.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Services Offered
              </h2>
              <ul className="space-y-2">
                {service.services.map((serviceItem, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      {typeof serviceItem === 'string' 
                        ? serviceItem 
                        : typeof serviceItem === 'object' && serviceItem !== null
                          ? JSON.stringify(serviceItem)
                          : String(serviceItem)
                      }
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Service Availability</p>
                  <p className="text-gray-600">Contact for operating hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Service Type</p>
                  <p className="text-gray-600 capitalize">{service.category?.replace('-', ' ') || 'General Legal Service'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              {service.contact && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">{service.contact}</p>
                  </div>
                </div>
              )}
              {service.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">{service.location}</p>
                  </div>
                </div>
              )}
              {service.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Website</p>
                    <a 
                      href={service.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Get Help</h2>
            <div className="space-y-3">
              <Button className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 border-gray-900">
                Contact Service Provider
              </Button>
              <Button variant="outline" className="w-full">
                Ask a Legal Question
              </Button>
              <Button variant="outline" className="w-full">
                Find Similar Services
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
