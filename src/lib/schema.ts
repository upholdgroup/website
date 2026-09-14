import type { Job } from "./content/jobs";
import { regions } from "./content/regions";
import type { Faq } from "./content/trades";
import { phoneInternational, site } from "./site";

const abs = (path: string) => `${site.url}${path === "/" ? "" : path}`;

/*
  No PostalAddress and no GeoCoordinates anywhere in this file.

  This is a service-area business: the desk answers a phone and crews travel to
  sites, and there is no address a visitor could turn up to. Publishing a
  street address and a lat/lng for one would be a false representation, and
  Google's own guidance for service-area businesses is to omit the address
  rather than list a location you do not occupy.

  `areaServed` carries the whole geographic claim instead, and it is built from
  the regions file, so it widens when the business does.
*/

/** Greater Sydney plus the eight regions — never "Australia". */
const areaServed = [
  { "@type": "City", name: "Sydney", address: { "@type": "PostalAddress", addressRegion: "NSW", addressCountry: "AU" } },
  ...regions.map((region) => ({ "@type": "AdministrativeArea", name: region.name })),
];

/** The organisation node every other node points at. */
export const organisationId = `${site.url}/#organisation`;

export function organisationSchema() {
  return {
    "@context": "https://schema.org",
    /*
      EmploymentAgency and Organization, not LocalBusiness. LocalBusiness
      describes somewhere a customer can visit and expects an address; without
      a premises it is the wrong type and an incomplete one.
    */
    "@type": ["EmploymentAgency", "Organization"],
    "@id": organisationId,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    description: site.description,
    // International form: this node is read by machines, not by a visitor.
    telephone: phoneInternational(site.phone),
    email: site.hireEmail,
    areaServed,
    // Matches the hire desk, not an office day.
    openingHoursSpecification: site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    knowsAbout: [
      "Construction labour hire",
      "Traffic control",
      "Formwork carpentry",
      "Scaffolding and rigging",
      "Civil plant operation",
    ],
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function serviceSchema({
  name,
  description,
  path,
  serviceType,
}: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    url: abs(path),
    provider: { "@id": organisationId },
    areaServed,
  };
}

/**
 * `baseSalary` is deliberately omitted. It is optional in the schema, and
 * leaving it out is the honest form of not publishing rates.
 */
export function jobPostingSchema(job: Job) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    identifier: { "@type": "PropertyValue", name: site.name, value: job.id },
    title: job.title,
    description: job.summary,
    datePosted: job.posted,
    validThrough: job.validThrough,
    employmentType: job.employmentType === "Casual" ? "PART_TIME" : "FULL_TIME",
    totalJobOpenings: job.positions,
    hiringOrganization: { "@id": organisationId },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.suburb,
        addressRegion: "NSW",
        addressCountry: "AU",
      },
    },
    directApply: true,
    url: abs(`/jobs/${job.slug}`),
  };
}
