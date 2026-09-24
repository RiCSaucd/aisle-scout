package com.example.aislescout.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(
    entities = [
        ListItemEntity::class,
        InventoryEntity::class,
        PriceLogEntity::class,
        ClippedDealEntity::class
    ],
    version = 2,
    exportSchema = false
)
abstract class AisleScoutDatabase : RoomDatabase() {
    abstract fun dao(): AisleScoutDao

    companion object {
        @Volatile
        private var INSTANCE: AisleScoutDatabase? = null

        fun getDatabase(context: Context): AisleScoutDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AisleScoutDatabase::class.java,
                    "aisle_scout_database"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}
