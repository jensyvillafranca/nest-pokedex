import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguracion } from './config/env.config';
import { JoiValidacionEsquema } from './config/joi.validation';

@Module({ 
  imports: [ 
    ConfigModule.forRoot({
      load: [EnvConfiguracion], // este hace conversiones y mapeos
      validationSchema: JoiValidacionEsquema, // 
    }),

    ServeStaticModule.forRoot({ 
      rootPath: join(__dirname, '', 'public'), 
    }), 
    
    MongooseModule.forRoot( process.env.MONGODB!, {
      dbName: 'pokemonsdb'
    }),
    PokemonModule,
    CommonModule,
    SeedModule, 
  ], 
})
export class AppModule {}
