# -*- coding: utf-8 -*-
# @PydevCodeAnalysisIgnore
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'SivunElementti.teksti'
        db.alter_column(u'albumi_sivunelementti', 'teksti_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['albumi.Teksti'], null=True))

        # Changing field 'SivunElementti.kuva'
        db.alter_column(u'albumi_sivunelementti', 'kuva_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['albumi.Kuva'], null=True))

    def backwards(self, orm):

        # Changing field 'SivunElementti.teksti'
        db.alter_column(u'albumi_sivunelementti', 'teksti_id', self.gf('django.db.models.fields.related.ForeignKey')(default=None, to=orm['albumi.Teksti']))

        # Changing field 'SivunElementti.kuva'
        db.alter_column(u'albumi_sivunelementti', 'kuva_id', self.gf('django.db.models.fields.related.ForeignKey')(default=None, to=orm['albumi.Kuva']))

    models = {
        u'albumi.albumi': {
            'Meta': {'object_name': 'Albumi'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'kayttaja': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"}),
            'koko_x': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'koko_y': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'nimi': ('django.db.models.fields.CharField', [], {'max_length': "'100'"})
        },
        u'albumi.kuva': {
            'Meta': {'object_name': 'Kuva'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nimi': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        },
        u'albumi.sivu': {
            'Meta': {'object_name': 'Sivu'},
            'albumi': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['albumi.Albumi']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'sivunumero': ('django.db.models.fields.PositiveIntegerField', [], {})
        },
        u'albumi.sivunelementti': {
            'Meta': {'object_name': 'SivunElementti'},
            'ankkuripiste_x': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'ankkuripiste_y': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'elementinTyyppi': ('django.db.models.fields.CharField', [], {'max_length': '3', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'koko_x': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'koko_y': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'kuva': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['albumi.Kuva']", 'null': 'True', 'blank': 'True'}),
            'sivu': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['albumi.Sivu']"}),
            'teksti': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['albumi.Teksti']", 'null': 'True', 'blank': 'True'})
        },
        u'albumi.teksti': {
            'Meta': {'object_name': 'Teksti'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'teksti': ('django.db.models.fields.TextField', [], {})
        },
        u'albumi.tilaus': {
            'Meta': {'object_name': 'Tilaus'},
            'albumi': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['albumi.Albumi']"}),
            'albuminKoko_x': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'albuminKoko_y': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'hinta': ('django.db.models.fields.FloatField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'kayttaja': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"}),
            'maksettu': ('django.db.models.fields.BooleanField', [], {}),
            'tilausAika': ('django.db.models.fields.DateTimeField', [], {})
        },
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Group']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Permission']"}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['albumi']
