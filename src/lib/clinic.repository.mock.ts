/**
 * Mock Clinic Repository for testing
 * In production, this would be replaced with a real implementation
 */

export interface Clinic {
  id: string
  name: string
}

export class MockClinicRepository {
  async findDefault(): Promise<Clinic | null> {
    // Return a mock clinic for testing
    // In production, this would query the database
    return {
      id: 'clinic-1',
      name: 'Default Clinic',
    }
  }
}
