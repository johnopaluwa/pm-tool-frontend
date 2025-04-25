import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  mockProjects = [
    {
      id: 1,
      name: 'Project Alpha',
      client: 'Client A',
      status: 'Active',
      description: 'This is a description for Project Alpha.',
      projectType: 'Web App',
      clientIndustry: 'Finance',
      techStack: ['React', 'Node', 'AWS'],
      teamSize: '4-6',
      duration: '3-6 months',
      keywords: 'User auth, payment gateway',
      businessSpecification:
        'Detailed requirements for user authentication and payment processing.',
    },
    {
      id: 2,
      name: 'Project Beta',
      client: 'Client B',
      status: 'Planning',
      description: 'This is a description for Project Beta.',
      projectType: 'Mobile App',
      clientIndustry: 'Retail',
      techStack: ['Angular', 'Azure'],
      teamSize: '1-3',
      duration: '<1 month',
      keywords: 'Push notifications, user profiles',
      businessSpecification:
        'Specifications for mobile app features including push notifications and user profile management.',
    },
    {
      id: 3,
      name: 'Project Gamma',
      client: 'Client C',
      status: 'Completed',
      description: 'This is a description for Project Gamma.',
      projectType: 'API',
      clientIndustry: 'Healthcare',
      techStack: ['Python', 'AWS'],
      teamSize: '7-10',
      duration: '6+ months',
      keywords: 'Data integration, security',
      businessSpecification:
        'API requirements focusing on secure data integration and handling sensitive healthcare information.',
    },
  ];

  getProjectById(id: number) {
    return this.mockProjects.find((project) => project.id === id);
  }

  addProject(project: any) {
    // Simple ID generation for mock data
    const newId =
      this.mockProjects.length > 0
        ? Math.max(...this.mockProjects.map((p) => p.id)) + 1
        : 1;
    const newProject = {
      ...project, // Include all other properties
      id: newId,
      name: project.projectName, // Map projectName to name
      client: project.clientName, // Map clientName to client
      status: 'Planning', // Assign default status
    };
    this.mockProjects.push(newProject);
    console.log('New project added:', newProject);
    console.log('All projects:', this.mockProjects);
    return newId; // Return the new project's ID
  }
}
