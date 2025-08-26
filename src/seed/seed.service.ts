import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/pokemon-response-interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor( 
    @InjectModel(Pokemon.name) 
    private pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}



  async ejecutarSeed() {
    await this.pokemonModel.deleteMany({}); // delete * from pokemons

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonParaInsertar: { name: string, no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segmentos = url.split('/');
      const no = +segmentos[ segmentos.length - 2];

      pokemonParaInsertar.push({ name, no});
    })
    await this.pokemonModel.insertMany(pokemonParaInsertar);

    return 'Semilla ejecutada exitosamente';
  }
}
