/** Lo que necesita tener para una clase adaptadora */

export interface HttpAdapter {
    get<T>( url: string): Promise<T>
}